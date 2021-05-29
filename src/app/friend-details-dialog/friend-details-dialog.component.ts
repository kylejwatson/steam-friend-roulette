import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatRelative } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Friend } from '../friend';
import { GameDetails } from '../game';
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

  gameDetails(): GameDetails | undefined {
    const gameid = this.friend?.gameid;
    return gameid ? this.steamService.getGameDetails(Number.parseInt(gameid, 10)) : undefined;
  }

  formatTimestamp(time?: number): string {
    return time === undefined ? '' : formatRelative(new Date(time * 1000), new Date(), { locale: enGB });
  }
}
