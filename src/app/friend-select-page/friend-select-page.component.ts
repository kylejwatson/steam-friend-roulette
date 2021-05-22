import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { SteamIdParam } from '../steam-id-param';
import { SteamService } from '../steam.service';
import { Location } from '@angular/common';
import { Friend } from '../friend';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-friend-select-page',
  templateUrl: './friend-select-page.component.html',
  styleUrls: ['./friend-select-page.component.scss']
})
export class FriendSelectPageComponent extends SteamIdParam implements OnInit {
  loading = true;
  searchInput = '';
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger?: MatAutocompleteTrigger;
  searchForm = new FormControl('', () => {
    if (!this.searchInput) {
      return null;
    }
    if (!this.findFriend()) {
      return [{ id: 1 }];
    }
    return null;
  });

  constructor(
    router: Router,
    route: ActivatedRoute,
    cookie: CookieService,
    location: Location,
    public steamService: SteamService,
    private document: Document,
    private window: Window
  ) { super(router, route, cookie, location); }

  ngOnInit(): void {
    this.getSteamId(
      () => this.getFriends(),
      () => this.router.navigate(['/steam-id'])
    );
  }

  getFriends(): void {
    this.loading = true;
    this.steamService.getFriends(this.steamId).subscribe(() => this.loading = false);
  }

  getGames(): void {
    this.router.navigate(['/game-view'], { queryParams: { id: this.steamId } });
  }

  goBack(): void {
    this.router.navigate(['/steam-id'], { queryParams: { id: this.steamId } });
  }
  refresh(): void {
    this.getFriends();
  }
  filteredFriends(): Friend[] {
    return this.steamService.friends.filter(friend => friend.personaname.toLowerCase().includes(this.searchInput.toLowerCase()));
  }
  displayFn(personaname: string): string {
    return personaname || '';
  }
  onSearch(): void {
    const found = this.findFriend();
    if (found) {
      const element = this.document.getElementById(found.steamid + '-card');
      element?.scrollIntoView({ behavior: 'smooth' });
      this.autocompleteTrigger?.closePanel();
    }
  }
  findFriend(): Friend | undefined {
    if (!this.searchInput) {
      return undefined;
    }
    const found = this.steamService.friends.find(friend => friend.personaname.toLowerCase().includes(this.searchInput.toLowerCase()));
    if (found) {
      return found;
    }
    return undefined;
  }

  scrollToTop(): void {
    this.window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }
}
