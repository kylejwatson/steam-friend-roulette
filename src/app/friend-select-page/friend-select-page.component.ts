import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { SteamIdParam } from '../steam-id-param';
import { SteamService } from '../steam.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-friend-select-page',
  templateUrl: './friend-select-page.component.html',
  styleUrls: ['./friend-select-page.component.scss']
})
export class FriendSelectPageComponent extends SteamIdParam implements OnInit {
  loading = true;

  constructor(
    router: Router,
    route: ActivatedRoute,
    cookie: CookieService,
    location: Location,
    public steamService: SteamService,
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
}
