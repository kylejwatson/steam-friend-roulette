import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../game';
import { SteamService } from '../steam.service';

@Component({
  selector: 'app-game-view-page',
  templateUrl: './game-view-page.component.html',
  styleUrls: ['./game-view-page.component.scss']
})
export class GameViewPageComponent implements OnInit {

  games: Game[] = [];
  steamId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private steamService: SteamService
  ) { }

  ngOnInit(): void {
    this.getSteamId();
  }
  getSteamId(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/steam-id']);
        return;
      }
      this.steamId = id;
      this.getSelectedFriends();
    });
  }

  getSelectedFriends(): void {
    if (this.steamService.selectedFriends.length === 0) {
      this.router.navigate(['/friend-select', { id: this.steamId }]);
      return;
    }
    this.getGames();
  }

  getGames(): void {
    const steamIds = this.steamService.selectedFriends.map(friend => friend.steamid);
    steamIds.unshift(this.steamId);
    this.steamService.getGames(steamIds).subscribe(games => this.games = games);
  }

  goBack(): void {
    this.router.navigate(['/friend-select', { id: this.steamId }]);
  }
}
