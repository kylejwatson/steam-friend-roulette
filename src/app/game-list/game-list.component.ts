import { Component, Inject, Input, OnInit } from '@angular/core';
import { Category, Game, Genre, UserStats } from '../game';
import { SteamService } from '../steam.service';

interface CategoryIcon {
  title: string;
  icon: string;
}

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
  getGameDescription(game: Game): string {
    return this.steamService.getGameDetails(game.appid)?.short_description || '';
  }
  getGenres(game: Game): Genre[] {
    return this.steamService.getGameDetails(game.appid)?.genres || [];
  }
  getCategories(game: Game): CategoryIcon[] {
    const categories = this.steamService.getGameDetails(game.appid)?.categories;
    if (!categories) {
      return [];
    }
    const filtered = [];
    const pvp = categories.find(category => category.id === 36 || category.id === 49);
    const coop = categories.find(category => category.id === 9 || category.id === 38);
    const mmo = categories.find(category => category.id === 20);
    const multiplayer = pvp || coop || mmo || categories.find(category => category.id === 1);
    const singleplayer = categories.find(category => category.id === 2);

    if (singleplayer) {
      filtered.push({ title: 'Singleplayer', icon: 'person_outline' });
    }
    if (multiplayer) {
      filtered.push({ title: 'Multiplayer', icon: 'groups' });
    }
    if (pvp) {
      filtered.push({ title: 'PvP', icon: 'sports_kabaddi' });
    }
    if (coop) {
      filtered.push({ title: 'Co-op', icon: 'people' });
    }
    if (mmo) {
      filtered.push({ title: 'MMO', icon: 'public' });
    }
    return filtered;
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
