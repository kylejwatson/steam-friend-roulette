import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Friend } from '../friend';
import { SteamIdParam } from '../steam-id-param';
import { SteamService } from '../steam.service';

@Component({
  selector: 'app-friend-select-page',
  templateUrl: './friend-select-page.component.html',
  styleUrls: ['./friend-select-page.component.scss']
})
export class FriendSelectPageComponent extends SteamIdParam implements OnInit {

  friends: Friend[] = [];

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private steamService: SteamService
  ) { super(route); }

  ngOnInit(): void {
    this.getSteamId(
      () => this.getFriends(),
      () => this.router.navigate(['/steam-id'])
    );
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
    this.steamService.selectedFriends = this.selectedFriends();
    this.router.navigate(['/game-view', { id: this.steamId }]);
  }

  goBack(): void {
    this.router.navigate(['/steam-id', { id: this.steamId }]);
  }
}
