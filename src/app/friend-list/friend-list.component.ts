import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Friend } from '../friend';
import { GameDetails } from '../game';
import { SteamService } from '../steam.service';
import { formatRelative } from 'date-fns';
import { enGB } from 'date-fns/locale';

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
    if (friend.gameid || friend.personastate === 1) {
      return '';
    }
    const date = new Date(friend.lastlogoff * 1000);
    const dateText = formatRelative(date, new Date(), { locale: enGB });

    return dateText.charAt(0).toUpperCase() + dateText.substring(1);
  }
  getStatus(friend: Friend): string {
    const details = this.getGameDetails(friend);
    if (details) {
      return details.name;
    }
    return this.lastLoggedOff(friend) || 'Online';
  }
}
