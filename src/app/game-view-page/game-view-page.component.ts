import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { categories, Category, Game } from '../game';
import { SteamIdParam } from '../steam-id-param';
import { SteamService } from '../steam.service';
import { Location } from '@angular/common';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-game-view-page',
  templateUrl: './game-view-page.component.html',
  styleUrls: ['./game-view-page.component.scss']
})
export class GameViewPageComponent extends SteamIdParam implements OnInit {

  searchInput = '';
  currentSearch = '';
  games: Game[] = [];
  loading = true;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger?: MatAutocompleteTrigger;

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
    this.steamService.getSharedGames(steamIds).subscribe(games => {
      this.games = games;
      this.loading = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/friend-select'], { queryParams: { id: this.steamId } });
  }

  filteredResults(): Game[] {
    return this.games.filter(game => game.name.toLowerCase().includes(this.searchInput.toLowerCase()));
  }
  displayFn(game: string): string {
    return game || '';
  }
  onSearch(): void {
    this.currentSearch = this.searchInput;
    this.autocompleteTrigger?.closePanel();
  }
  searchedGames(): Game[] {
    if (!this.currentSearch || !this.searchInput) {
      this.currentSearch = '';
      return this.games;
    }
    return this.games.filter(game => game.name.toLowerCase().includes(this.currentSearch.toLowerCase()));
  }
  filteredGames(): Game[] {
    const enabledCategories = categories.filter(category => category.checked);
    const searched = this.searchedGames();
    if (enabledCategories.length === categories.length) {
      return searched;
    }
    const games = searched.filter(game => {
      const details = this.steamService.getGameDetails(game.appid);
      return details?.categories.some(category => {
        return enabledCategories.find(enabled => enabled.id === category.id);
      });
    });

    return games;
  }
  gamesIncludeCategory(games: Game[], category: Category): boolean {
    return games.some(game => {
      const details = this.steamService.getGameDetails(game.appid);
      return details?.categories.find(findCategory => {
        return findCategory.id === category.id;
      });
    });
  }
  getCategories(): Category[] {
    return categories.filter(category => this.gamesIncludeCategory(this.games, category));
  }
  categoryDisabled(category: Category): boolean {
    if (!this.currentSearch) {
      return false;
    }
    return !this.gamesIncludeCategory(this.searchedGames(), category);
  }
}
