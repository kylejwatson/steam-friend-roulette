import { Component, OnInit } from '@angular/core';
import { Friend } from '../friend';
import { SteamService } from '../steam.service';
import { Game } from '../game';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  friends: Friend[] = [];
  games: Game[] = [];
  steamId = '76561198041984934';

  constructor(private steamService: SteamService) { }

  ngOnInit(): void {
    this.getFriends();
  }

  getFriends(): void {
    this.steamService.getFriends(this.steamId).subscribe(friends => this.friends = friends);
  }

  onlineFriends(): Friend[] {
    return this.friends.filter(friend => friend.personastate === 1 && !friend.selected);
  }
  inGameFriends(): Friend[] {
    return this.friends.filter(friend => friend.gameid && !friend.selected);
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
  getGames(): void {
    const steamIds = this.selectedFriends().map(friend => friend.steamid);
    steamIds.unshift(this.steamId);
    this.steamService.getGames(steamIds).subscribe(games => this.games = games);
  }
}
