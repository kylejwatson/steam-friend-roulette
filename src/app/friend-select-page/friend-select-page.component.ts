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
  loading = true;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    public steamService: SteamService
  ) { super(route); }

  ngOnInit(): void {
    this.getSteamId(
      () => this.getFriends(),
      () => this.router.navigate(['/steam-id'])
    );
  }

  getFriends(): void {
    this.loading = true;
    this.steamService.getFriends(this.steamId).subscribe(() => this.loading = false);
  }

  getGames(): void {
    this.router.navigate(['/game-view', { id: this.steamId }]);
  }

  goBack(): void {
    this.router.navigate(['/steam-id', { id: this.steamId }]);
  }
  refresh(): void {
    this.getFriends();
  }
}
