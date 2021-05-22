import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Friend } from './friend';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Category, Game, GameDetails } from './game';

@Injectable({
  providedIn: 'root'
})
export class SteamService {
  constructor(private http: HttpClient) { }

  friends: Friend[] = [];
  games: GameDetails[] = [];

  private makeFriendsUrl(steamId: string): string {
    return `${environment.serverUrl}/friendSummary?steamid=${steamId}`;
  }
  private makeSharedGamesUrl(steamIds: string[]): string {
    return `${environment.serverUrl}/shared?steamids=${steamIds.join()}`;
  }
  private makeGamesUrl(appIds: number[]): string {
    return `${environment.serverUrl}/app?appids=${appIds.join()}`;
  }
  private makeGameImageUrls(game: Game): Game {
    return {
      ...game,
      img_icon_url: `${environment.steamImageUrl}/${game.appid}/${game.img_icon_url}.jpg`,
      img_logo_url: `${environment.steamImageUrl}/${game.appid}/${game.img_logo_url}.jpg`
    };
  }

  getFriends(steamId: string): Observable<Friend[]> {
    const url = this.makeFriendsUrl(steamId);
    const friendsResponse = this.http.get<Friend[]>(url);
    friendsResponse.subscribe(friends => {
      const gameIds: number[] = [];
      this.friends = friends.map(friend => {
        if (friend.gameid) {
          gameIds.push(Number.parseInt(friend.gameid, 10));
        }
        const alreadyLoaded = this.friends.find(currentFriend => currentFriend.steamid === friend.steamid);
        return {
          ...friend,
          selected: alreadyLoaded?.selected
        };
      });
      this.getGames(gameIds);
    });
    return friendsResponse;
  }

  onlineFriends(): Friend[] {
    return this.friends.filter(friend => (friend.personastate === 1 || friend.gameid) && !friend.selected);
  }
  selectedFriends(): Friend[] {
    return this.friends.filter(friend => friend.selected);
  }
  otherFriends(): Friend[] {
    return this.friends.filter(friend => friend.personastate !== 1 && !friend.gameid && !friend.selected);
  }
  toggleFriend(steamId: string): void {
    const toggledFriend = this.friends.find(friend => friend.steamid === steamId);
    if (toggledFriend) {
      toggledFriend.selected = !toggledFriend.selected;
    }
  }
  getSharedGames(steamIds: string[]): Observable<Game[]> {
    const url = this.makeSharedGamesUrl(steamIds);
    const gamesResponse = this.http.get<Game[]>(url);

    return gamesResponse.pipe(map(games => {
      const gameIds = games.map(game => game.appid);
      this.getGames(gameIds);
      return games.map(this.makeGameImageUrls);
    }));
  }
  getGames(appIds: number[]): void {
    const ids = appIds.filter(id => !this.games.find(game => game.steam_appid === id));
    if (!ids.length) {
      return;
    }
    const url = this.makeGamesUrl(appIds);
    const gamesResponse = this.http.get<(GameDetails | number)[]>(url);
    gamesResponse.subscribe(games => {
      const foundGames = games.filter(game => typeof game !== 'number') as GameDetails[];
      const lostGames: number[] = [];
      games.forEach((game, index) => {
        if (typeof game === 'number') {
          lostGames.push(ids[index]);
        }
      });
      if (lostGames.length) {
        console.info('404 - Could not find: ' + lostGames);
      }

      this.games.push(...foundGames);
    });
  }
  getGameDetails(appId: number): GameDetails | undefined {
    return this.games.find(game => game.steam_appid === appId);
  }
  gamesIncludeCategory(games: Game[], category: Category): boolean {
    return games.some(game => {
      const details = this.getGameDetails(game.appid);
      return details?.categories.find(findCategory => {
        return findCategory.id === category.id;
      });
    });
  }
}
