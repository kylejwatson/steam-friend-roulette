import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { SteamIdParam } from '../steam-id-param';
import { SteamService } from '../steam.service';
import { Location } from '@angular/common';
import { Friend } from '../friend';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

enum Filter {
  Online = 1,
  InGame,
  Offline
}
@Component({
  selector: 'app-friend-select-page',
  templateUrl: './friend-select-page.component.html',
  styleUrls: ['./friend-select-page.component.scss']
})
export class FriendSelectPageComponent extends SteamIdParam implements OnInit {
  loading = true;
  searchInput = '';
  filters = [Filter.Online, Filter.InGame, Filter.Offline];
  loggedoff = 0;
  alphabetical = -1;
  since = 0;

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
    private window: Window,
    snackBar: MatSnackBar
  ) { super(router, route, cookie, location, snackBar); }

  ngOnInit(): void {
    this.getSteamId().subscribe(steamId => {
      if (steamId) {
        this.getFriends();
      } else {
        if (!this.steamId) {
          this.snackBar.open('Please enter your Steam ID first', 'Close', {
            duration: 3000
          });
        }
        this.router.navigate(['/steam-id']);
      }
    });
  }

  getFriends(): void {
    this.loading = true;
    this.steamService.getFriends(this.steamId).pipe(
      catchError(err => {
        if (err.status === 404) {
          this.snackBar.open('Steam profile not found', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/steam-id'], { queryParams: { id: this.steamId } });
        }
        return of(undefined);
      })
    ).subscribe(friends => {
      if (!friends) {
        return;
      }
      this.loading = false;
      if (friends.length === 0) {
        this.snackBar.open('No friends were found', 'Close', {
          duration: 3000
        });
      }
    });
  }

  getGames(): void {
    this.router.navigate(['/game-view'], { queryParams: { id: this.steamId } });
    const friendIds = this.steamService.selectedFriends().map(friend => friend.steamid);
    this.steamService.friendSelectionCookie[this.steamId] = friendIds;

    this.saveCookie('friendSelection', JSON.stringify(this.steamService.friendSelectionCookie));
  }

  goBack(): void {
    this.router.navigate(['/steam-id'], { queryParams: { id: this.steamId } });
  }
  refresh(): void {
    this.getFriends();
  }
  filteredFriendsAutoComplete(): Friend[] {
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
  filterSelected(friends: Friend[]): Friend[] {
    return this.filteredFriends(friends.filter(friend => !friend.selected));
  }
  filteredFriends(friends: Friend[]): Friend[] {
    const filtered = friends.filter(friend => {
      const online = this.filters.includes(Filter.Online) && friend.personastate === 1 && !friend.gameid;
      const inGame = this.filters.includes(Filter.InGame) && friend.gameid;
      const offline = this.filters.includes(Filter.Offline) && friend.personastate !== 1 && !friend.gameid;
      return online || inGame || offline;
    });
    return this.orderFriends(filtered);
  }
  toggleAlphabetical(): void {
    if (this.alphabetical === 0) {
      this.since = 0;
      this.loggedoff = 0;
      this.alphabetical = 1;
    } else {
      this.alphabetical = -this.alphabetical;
    }
  }
  toggleLoggedOff(): void {
    if (this.loggedoff === 0) {
      this.since = 0;
      this.alphabetical = 0;
      this.loggedoff = 1;
    } else {
      this.loggedoff = -this.loggedoff;
    }
  }
  toggleFriendSince(): void {
    if (this.since === 0) {
      this.alphabetical = 0;
      this.loggedoff = 0;
      this.since = 1;
    } else {
      this.since = -this.since;
    }
  }
  orderFriends(friends: Friend[]): Friend[] {
    return friends.sort((friendA, friendB) => {
      if (this.loggedoff !== 0) {
        if (!friendA.lastlogoff) {
          return friendB.lastlogoff ? 1 : 0;
        }
        if (!friendB.lastlogoff) {
          return 0;
        }
        return this.loggedoff === 1 ? friendA.lastlogoff - friendB.lastlogoff : friendB.lastlogoff - friendA.lastlogoff;
      }
      if (this.since !== 0) {
        if (!friendA.friend_since) {
          return friendB.friend_since ? 1 : 0;
        }
        if (!friendB.friend_since) {
          return 0;
        }
        return this.since === 1 ? friendA.friend_since - friendB.friend_since : friendB.friend_since - friendA.friend_since;
      }
      if (friendA.personaname.toLowerCase() < friendB.personaname.toLowerCase()) {
        return this.alphabetical;
      }
      if (friendA.personaname.toLowerCase() > friendB.personaname.toLowerCase()) {
        return -this.alphabetical;
      }

      return 0;
    });
  }
}
