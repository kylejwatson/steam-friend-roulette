import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Friend } from './friend';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  constructor(private http: HttpClient) { }

  private makeFriendsUrl(steamId: string): string {
    return `${environment.serverUrl}/friendSummary?steamid=${steamId}`;
  }

  getFriends(steamId: string): Observable<Friend[]> {
    const url = this.makeFriendsUrl(steamId);
    const friendsResponse = this.http.get<Friend[]>(url);
    return friendsResponse;
  }
}
