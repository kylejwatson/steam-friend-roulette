import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { categories, Category, Game } from '../game';
import { SteamIdParam } from '../steam-id-param';
import { SteamService } from '../steam.service';
import { Location } from '@angular/common';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Friend } from '../friend';
import { MatSelectChange } from '@angular/material/select';

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
  alphabetical = 0;
  twoWeeks = 1;
  allTime = 0;
  orderUser = '';

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger?: MatAutocompleteTrigger;

  constructor(
    router: Router,
    route: ActivatedRoute,
    cookie: CookieService,
    location: Location,
    private steamService: SteamService,
    snackBar: MatSnackBar
  ) { super(router, route, cookie, location, snackBar); }

  ngOnInit(): void {
    this.getSteamId(
      () => this.getSelectedFriends(),
      () => this.router.navigate(['/steam-id'])
    );
  }

  getSelectedFriends(): void {
    if (this.steamService.selectedFriends().length === 0) {
      this.snackBar.open('Please select friends from your friends list first', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.router.navigate(['/friend-select'], { queryParams: { id: this.steamId } });
      return;
    }
    this.orderUser = this.steamId;
    this.getGames();
  }

  selectedFriends(): Friend[] {
    return this.steamService.selectedFriends();
  }

  getGames(): void {
    this.loading = true;
    const steamIds = this.steamService.selectedFriends().map(friend => friend.steamid);
    steamIds.unshift(this.steamId);
    this.steamService.getSharedGames(steamIds).subscribe(games => {
      this.games = games;
      if (games.length === 0) {
        this.snackBar.open('No games in common found between you and the friends you selected, try selecting less friends', 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
      this.loading = false;
    }, () => this.goBack());
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
  enabledCategories(categoryList: Category[]): Category[] {
    const enabled: Category[] = [];
    categoryList.forEach(category => {
      if (category.checked) {
        enabled.push(category);
      }
      if (category.subcategories) {
        const subEnabled = this.enabledCategories(category.subcategories);
        enabled.push(...subEnabled);
      }
    });
    return enabled;
  }
  filteredGames(): Game[] {
    const searched = this.searchedGames();
    const enabledCategories = this.enabledCategories(categories);
    const games = searched.filter(game => {
      const details = this.steamService.getGameDetails(game.appid);
      if (!details) {
        return true;
      }
      return details.categories.some(category => {
        return enabledCategories.find(enabled => enabled.id === category.id);
      });
    });
    return this.orderGames(games);
  }

  getCategories(): Category[] {
    return categories.filter(category => this.steamService.gamesIncludeCategory(this.games, category));
  }

  toggleAlphabetical(): void {
    if (this.alphabetical === 0) {
      this.allTime = 0;
      this.twoWeeks = 0;
      this.alphabetical = 1;
    } else {
      this.alphabetical = -this.alphabetical;
    }
  }
  toggleTwoWeeks(): void {
    if (this.twoWeeks === 0) {
      this.allTime = 0;
      this.alphabetical = 0;
      this.twoWeeks = 1;
    } else {
      this.twoWeeks = -this.twoWeeks;
    }
  }
  toggleAllTime(): void {
    if (this.allTime === 0) {
      this.alphabetical = 0;
      this.twoWeeks = 0;
      this.allTime = 1;
    } else {
      this.allTime = -this.allTime;
    }
  }

  orderGames(games: Game[]): Game[] {
    const orderId = this.orderUser || this.steamId;
    return games.sort((gameA, gameB) => {
      const userStatsA = gameA.userStats.find(user => user.steamId === orderId);
      const userStatsB = gameB.userStats.find(user => user.steamId === orderId);
      if (this.twoWeeks !== 0) {
        const twoWeeksA = userStatsA?.playtime_2weeks || 0;
        const twoWeeksB = userStatsB?.playtime_2weeks || 0;
        return this.twoWeeks === 1 ?
          twoWeeksA - twoWeeksB :
          twoWeeksB - twoWeeksA;
      }
      if (this.allTime !== 0) {
        const allTimeA = userStatsA?.playtime_forever || 0;
        const allTimeB = userStatsB?.playtime_forever || 0;
        return this.allTime === 1 ?
          allTimeA - allTimeB :
          allTimeB - allTimeA;
      }

      if (gameA.name.toLowerCase() < gameB.name.toLowerCase()) {
        return this.alphabetical;
      }
      if (gameA.name.toLowerCase() > gameB.name.toLowerCase()) {
        return -this.alphabetical;
      }

      return 0;
    });
  }
  filtersChanged(event: MatSelectChange): void {
    const selectedIds: number[] = event.value;
    categories.forEach(category => {
      const isChecked = selectedIds.includes(category.id);
      category.checked = isChecked;
      this.setAll(category, isChecked);
    });
  }
  setAll(category: Category, checked: boolean): void {
    category.subcategories?.forEach(sub => {
      sub.checked = checked;
      this.setAll(sub, checked);
    });
  }
}
