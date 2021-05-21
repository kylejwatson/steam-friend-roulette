import { Component, Inject, Input, OnInit } from '@angular/core';
import { Game } from '../game';
import { SteamService } from '../steam.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {
  @Input() games: Game[] = [];

  constructor(
    private window: Window,
    private steamService: SteamService
  ) { }

  ngOnInit(): void {
  }

  convertGameTime(minutes: number): string {
    if (minutes === 0) {
      return 'Never played';
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 1) {
      return 'Played for less than an hour';
    }

    return `Played for ${hours} hours`;
  }

  scrollToTop(): void {
    this.window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  getCoverImage(game: Game): string {
    return this.steamService.getGameDetails(game.appid)?.header_image || game.img_logo_url;
  }
}
