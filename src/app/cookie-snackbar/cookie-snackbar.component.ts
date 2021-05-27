import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie';
import { defaultValues } from '../cookie';
import { CookieDialogComponent } from '../cookie-dialog/cookie-dialog.component';

@Component({
  selector: 'app-cookie-snackbar',
  templateUrl: './cookie-snackbar.component.html',
  styleUrls: ['./cookie-snackbar.component.scss']
})
export class CookieSnackbarComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private cookie: CookieService,
    public snackBarRef: MatSnackBarRef<CookieSnackbarComponent>
  ) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CookieDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.snackBarRef.dismissWithAction();
    });
  }

  reject(): void {
    this.snackBarRef.dismiss();
  }

  accept(): void {
    this.cookie.put('cookiePermission', JSON.stringify(defaultValues));
    this.snackBarRef.dismissWithAction();
  }
}
