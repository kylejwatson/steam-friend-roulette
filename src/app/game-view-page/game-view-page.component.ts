import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Game } from '../game';
import { SteamIdParam } from '../steam-id-param';
import { SteamService } from '../steam.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-game-view-page',
  templateUrl: './game-view-page.component.html',
  styleUrls: ['./game-view-page.component.scss']
})
export class GameViewPageComponent extends SteamIdParam implements OnInit {

  games: Game[] = [];
  loading = true;

  constructor(
    router: Router,
    route: ActivatedRoute,
    cookie: CookieService,
    location: Location,
    private steamService: SteamService
  ) { super(router, route, cookie, location); }

  ngOnInit(): void {
    this.getSteamId(
      () => this.getSelectedFriends(),
      () => this.router.navigate(['/steam-id'])
    );
  }

  getSelectedFriends(): void {
    if (this.steamService.selectedFriends().length === 0) {
      this.router.navigate(['/friend-select'], { queryParams: { id: this.steamId } });
      return;
    }
    this.getGames();
  }

  getGames(): void {
    this.loading = true;
    const steamIds = this.steamService.selectedFriends().map(friend => friend.steamid);
    steamIds.unshift(this.steamId);
    this.steamService.getGames(steamIds).subscribe(games => {
      this.games = games;
      this.loading = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/friend-select'], { queryParams: { id: this.steamId } });
  }
}
