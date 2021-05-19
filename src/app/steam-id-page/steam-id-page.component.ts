import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-steam-id-page',
  templateUrl: './steam-id-page.component.html',
  styleUrls: ['./steam-id-page.component.scss']
})
export class SteamIdPageComponent implements OnInit {

  steamId = '';
  loginUrl = `${environment.serverUrl}/auth`;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getSteamId();
  }

  getSteamId(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.steamId = id;
      }
    });
  }

  getFriends(): void {
    this.router.navigate(['/friend-select', { id: this.steamId }]);
  }
}
