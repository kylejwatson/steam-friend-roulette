import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SteamIdParam } from '../steam-id-param';

@Component({
  selector: 'app-steam-id-page',
  templateUrl: './steam-id-page.component.html',
  styleUrls: ['./steam-id-page.component.scss']
})
export class SteamIdPageComponent extends SteamIdParam implements OnInit {
  loginUrl = `${environment.serverUrl}/auth`;

  constructor(
    private router: Router,
    route: ActivatedRoute,
  ) {
    super(route);
  }

  ngOnInit(): void {
    this.getSteamId();
  }

  getFriends(): void {
    this.router.navigate(['/friend-select', { id: this.steamId }]);
  }
}
