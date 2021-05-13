import { Component, OnInit } from '@angular/core';
import { Friend } from '../friend';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  friends: Friend[] = [];

  constructor(private friendsService: FriendsService) { }

  ngOnInit(): void {
    this.getFriends();
  }

  getFriends(): void {
    this.friendsService.getFriends('76561198041984934').subscribe(friends => this.friends = friends);
  }

}
