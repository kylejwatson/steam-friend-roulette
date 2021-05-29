import { Component, Input, OnInit } from '@angular/core';
import formatRelative from 'date-fns/formatRelative';
import enGB from 'date-fns/locale/en-GB';
import { Friend } from '../friend';

@Component({
  selector: 'app-friend-status',
  templateUrl: './friend-status.component.html',
  styleUrls: ['./friend-status.component.scss']
})
export class FriendStatusComponent implements OnInit {


  @Input() friend?: Friend;
  constructor() { }

  ngOnInit(): void {
  }


  getGameName(): string | undefined {
    if (this.friend?.gameid) {
      return this.friend.gameextrainfo;
    }
    return undefined;
  }

  lastLoggedOff(): string {
    if (!this.friend || this.friend.gameid || this.friend.personastate === 1) {
      return '';
    }
    const date = new Date(this.friend.lastlogoff * 1000);
    const dateText = formatRelative(date, new Date(), { locale: enGB });

    return dateText.charAt(0).toUpperCase() + dateText.substring(1);
  }
  getStatus(): string {
    return this.getGameName() || this.lastLoggedOff() || 'Online';
  }
}
