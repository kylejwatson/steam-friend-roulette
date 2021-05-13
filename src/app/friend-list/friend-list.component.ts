import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Friend } from '../friend';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {

  @Output() selectedFriendEvent = new EventEmitter<string>();
  @Input() friends: Friend[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  selectFriend(friend: Friend): void {
    this.selectedFriendEvent.emit(friend.steamid);
  }

}
