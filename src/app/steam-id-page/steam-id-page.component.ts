import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SteamIdParam } from '../steam-id-param';
import { CookieService } from 'ngx-cookie';
import { Location } from '@angular/common';

@Component({
  selector: 'app-steam-id-page',
  templateUrl: './steam-id-page.component.html',
  styleUrls: ['./steam-id-page.component.scss']
})
export class SteamIdPageComponent extends SteamIdParam implements OnInit {
  loginUrl = `${environment.serverUrl}/auth`;

  constructor(
    router: Router,
    route: ActivatedRoute,
    cookie: CookieService,
    location: Location
  ) { super(router, route, cookie, location); }

  ngOnInit(): void {
    this.getSteamId();
  }

  getFriends(): void {
    this.cookie.put('steamid', this.steamId);
    this.router.navigate(['/friend-select'], { queryParams: { id: this.steamId } });
  }
}
