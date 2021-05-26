import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SteamIdParam } from '../steam-id-param';
import { CookieService } from 'ngx-cookie';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import * as SteamID from 'steamid';

@Component({
  selector: 'app-steam-id-page',
  templateUrl: './steam-id-page.component.html',
  styleUrls: ['./steam-id-page.component.scss']
})
export class SteamIdPageComponent extends SteamIdParam implements OnInit {
  loginUrl = `${environment.serverUrl}/auth`;
  idForm = new FormControl('', () => {
    if (!this.idForm?.value) {
      return null;
    }
    return this.isValidId() ? null : [{ id: 1 }];
  });

  constructor(
    router: Router,
    route: ActivatedRoute,
    cookie: CookieService,
    location: Location,
    private dialog: MatDialog,
    snackBar: MatSnackBar
  ) { super(router, route, cookie, location, snackBar); }

  ngOnInit(): void {
    this.getSteamId(() => {
      this.idForm.markAsDirty();
    });
  }

  getFriends(): void {
    this.cookie.put('steamid', this.steamId);
    this.router.navigate(['/friend-select'], { queryParams: { id: this.steamId } });
  }

  openDialog(): void {
    this.dialog.open(InfoDialogComponent);
  }

  isValidId(): boolean {
    const id = this.idForm.value;
    if (!id) {
      return false;
    }
    try {
      const steamId = new SteamID(id);
      return steamId.isValid();
    } catch (e) {
      return false;
    }
  }
}
