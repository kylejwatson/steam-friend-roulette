import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Friend } from './friend';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Game } from './game';

@Injectable({
  providedIn: 'root'
})
export class SteamService {
  constructor(private http: HttpClient) { }

  selectedFriends: Friend[] = [];

  private makeFriendsUrl(steamId: string): string {
    return `${environment.serverUrl}/friendSummary?steamid=${steamId}`;
  }
  private makeGamesUrl(steamIds: string[]): string {
    return `${environment.serverUrl}/shared?steamids=${steamIds}`;
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
    return friendsResponse;
  }

  getGames(steamIds: string[]): Observable<Game[]> {
    const url = this.makeGamesUrl(steamIds);
    const gamesResponse = this.http.get<Game[]>(url);

    return gamesResponse.pipe(map(games => games.map(this.makeGameImageUrls)));
  }
}
