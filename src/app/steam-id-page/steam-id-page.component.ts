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

@Component({
  selector: 'app-steam-id-page',
  templateUrl: './steam-id-page.component.html',
  styleUrls: ['./steam-id-page.component.scss']
})
export class SteamIdPageComponent extends SteamIdParam implements OnInit {
  loginUrl = `${environment.serverUrl}/auth`;
  idForm: FormControl = new FormControl('', () => {
    if (!this.idForm?.value) {
      return null;
    }
    return this.isValidId(this.idForm.value) ? null : [{ id: 1 }];
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
    this.getSteamId().subscribe(() => {
      this.idForm.markAsDirty();
    });
  }

  getFriends(): void {
    this.saveCookie('steamId', this.steamId);
    this.router.navigate(['/friend-select'], { queryParams: { id: this.steamId } });
  }

  openDialog(): void {
    const infoRef = this.dialog.open(InfoDialogComponent);
    infoRef.afterClosed().subscribe(() => {
      this.getCookiePermissions();
    });
  }

  steamSignInAllowed(): boolean {
    return !!this.cookiesAllowed?.session;
  }
}
