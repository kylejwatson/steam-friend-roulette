import { Component, Inject, Input, OnInit } from '@angular/core';
import { Game, UserStats } from '../game';
import { SteamService } from '../steam.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {
  @Input() games: Game[] = [];
  @Input() steamId = '';

  constructor(
    private window: Window,
    private steamService: SteamService
  ) { }

  ngOnInit(): void {
  }

  convertGameTime(minutes: number): string {
    if (!minutes) {
      return 'Not played';
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
  getName(userStat: UserStats): string {
    if (this.isUser(userStat)) {
      return 'You';
    }
    const friend = this.steamService.friends.find(findFriend => findFriend.steamid === userStat.steamId);
    return friend?.personaname || 'Friend';
  }
  isUser(userStat: UserStats): boolean {
    return userStat.steamId === this.steamId;
  }
}
