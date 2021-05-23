import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Friend } from '../friend';
import { GameDetails } from '../game';
import { SteamService } from '../steam.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {

  @Output() selectedFriendEvent = new EventEmitter<string>();
  @Input() friends: Friend[] = [];
  @Input() title = 'Friends';
  constructor(public steamService: SteamService) { }

  ngOnInit(): void {
  }

  selectFriend(friend: Friend): void {
    this.selectedFriendEvent.emit(friend.steamid);
  }

  selectAll(): void {
    this.friends.forEach(friend => this.selectFriend(friend));
  }

  scrollToTop(el: HTMLElement): void {
    el.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  getGameDetails(friend: Friend): GameDetails | undefined {
    if (friend.gameid) {
      return this.steamService.getGameDetails(Number.parseInt(friend.gameid, 10));
    }
    return undefined;
  }
  dateString(unix: number): string {
    return new Date(unix * 1000).toString();
  }
  lastLoggedOff(friend: Friend): string {
    const date = new Date(friend.lastlogoff * 1000);
    const dateString = date.toDateString();
    const timeString = date.toTimeString().split(' ').shift();
    if (dateString === new Date().toDateString()) {
      return `Today ${timeString}`;
    }
    return `${dateString} ${timeString}`;
  }
}
