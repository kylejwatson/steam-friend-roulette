import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-steam-id-page',
  templateUrl: './steam-id-page.component.html',
  styleUrls: ['./steam-id-page.component.scss']
})
export class SteamIdPageComponent implements OnInit {

  steamId = '';
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  getFriends(): void {
    this.router.navigate(['/friend-select', { id: this.steamId }]);
  }
}
