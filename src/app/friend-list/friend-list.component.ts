import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Friend } from '../friend';
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
}
