import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import formatRelative from 'date-fns/formatRelative';
import enGB from 'date-fns/locale/en-GB';
import { Friend } from '../friend';
import { SteamService } from '../steam.service';

@Component({
  selector: 'app-friend-details-dialog',
  templateUrl: './friend-details-dialog.component.html',
  styleUrls: ['./friend-details-dialog.component.scss']
})
export class FriendDetailsDialogComponent implements OnInit {

  friend?: Friend;

  constructor(
    @Inject(MAT_DIALOG_DATA) private steamId: string,
    private steamService: SteamService
  ) { }

  ngOnInit(): void {
    this.friend = this.steamService.friends.find(friend => friend.steamid === this.steamId);
  }

  formatTimestamp(time?: number): string {
    return time === undefined ? '' : formatRelative(new Date(time * 1000), new Date(), { locale: enGB });
  }
}
