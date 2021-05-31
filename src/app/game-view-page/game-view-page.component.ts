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
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-game-view-page',
  templateUrl: './game-view-page.component.html',
  styleUrls: ['./game-view-page.component.scss']
})
export class GameViewPageComponent extends SteamIdParam implements OnInit {

  searchInput = '';
  currentSearch = '';
  games: Game[] = [];
  sharedGames: Game[] = [];
  loading = true;
  alphabetical = 0;
  twoWeeks = 0;
  allTime = -1;
  orderUser = '';
  filters = [1, 2];
  owned = true;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger?: MatAutocompleteTrigger;

  constructor(
    router: Router,
    route: ActivatedRoute,
    cookie: CookieService,
    location: Location,
    private steamService: SteamService,
    snackBar: MatSnackBar,
    private titleService: Title
  ) { super(router, route, cookie, location, snackBar); }

  ngOnInit(): void {
    this.titleService.setTitle('Steamship - Games');
    this.getSteamId().subscribe(steamId => {
      if (steamId) {
        this.getSelectedFriends();
      } else {
        this.router.navigate(['/steam-id']);

        if (!this.steamId) {
          this.snackBar.open('Please enter your Steam ID first', 'Close', {
            duration: 3000
          });
        }
      }
    });
  }

  getSelectedFriends(): void {
    if (this.steamService.selectedIds(this.steamId).length === 0) {
      this.snackBar.open('Please select friends from your friends list first', 'Close', {
        duration: 3000
      });
      this.router.navigate(['/friend-select'], { queryParams: { id: this.steamId } });
      return;
    }
    if (this.steamService.friends.length === 0) {
      this.steamService.getFriends(this.steamId).subscribe();
    }
    this.orderUser = this.steamId;
    this.getGames();
  }

  selectedFriends(): Friend[] {
    return this.steamService.selectedFriends();
  }

  getGames(): void {
    this.loading = true;
    const steamIds = this.steamService.selectedIds(this.steamId);
    steamIds.unshift(this.steamId);

    this.steamService.getSharedGames(steamIds).subscribe(games => {
      this.games = games;

      const commonGames = games.filter(game => game.userStats.length === steamIds.length);
      if (commonGames.length === 0) {
        this.snackBar.open('No games in common found between you and the friends you selected, try selecting less friends', 'Close', {
          duration: 5000
        });
      }
      if (steamIds.length > 2) {
        this.sharedGames = games.filter(game => game.userStats.length >= 2);
      }
      this.loading = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/friend-select'], { queryParams: { id: this.steamId } });
  }

  filteredResults(): Game[] {
    return this.sharedGames.filter(game => game.name.toLowerCase().includes(this.searchInput.toLowerCase()));
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
      return this.sharedGames;
    }
    return this.sharedGames.filter(game => game.name.toLowerCase().includes(this.currentSearch.toLowerCase()));
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
    return categories.filter(category => this.steamService.gamesIncludeCategory(this.sharedGames, category));
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
    const sorted = games.sort((gameA, gameB) => {
      const userStatsA = gameA.userStats.find(user => user.steamId === orderId);
      const userStatsB = gameB.userStats.find(user => user.steamId === orderId);
      if (this.twoWeeks !== 0) {
        const twoWeeksA = userStatsA?.playtime_2weeks || -1;
        const twoWeeksB = userStatsB?.playtime_2weeks || -1;
        return this.twoWeeks === 1 ?
          twoWeeksA - twoWeeksB :
          twoWeeksB - twoWeeksA;
      }
      if (this.allTime !== 0) {
        const allTimeA = userStatsA?.playtime_forever || -1;
        const allTimeB = userStatsB?.playtime_forever || -1;
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
    if (this.owned) {
      sorted.sort((gameA, gameB) => {
        return gameB.userStats.length - gameA.userStats.length;
      });
    }
    return sorted;
  }
  getCategory(id: number): Category | undefined {
    return categories.find(category => category.id === id);
  }
  getFilterDescriptions(filters: number[]): string {
    return filters.map(filter => categories.find(category => category.id === filter)?.description).join(', ');
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
  toggleOwned(): void {
    this.owned = !this.owned;
  }
}
