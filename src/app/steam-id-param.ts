import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as SteamID from 'steamid';
import { CookieSnackbarComponent } from './cookie-snackbar/cookie-snackbar.component';
import { CookieSettings } from './cookie';

export class SteamIdParam {
    steamId = '';
    cookiesAllowed?: CookieSettings;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected cookie: CookieService,
        protected location: Location,
        protected snackBar: MatSnackBar
    ) { }

    getSteamId(): Observable<string> {
        return this.route.queryParamMap.pipe(map(params => {
            const id = params.get('id');
            if (id) {
                this.steamId = id;
                if (!this.isValidId(this.steamId)) {
                    this.snackBar.open('Invalid Steam ID', 'Close', {
                        duration: 3000
                    });
                    this.router.navigate(['/steam-id'], { queryParams: { id: this.steamId } });
                    return '';
                }
                this.saveCookie('steamId', this.steamId);
                return this.steamId;
            }
            this.steamId = this.cookie.get('steamId');
            const url = this.router.createUrlTree([], { relativeTo: this.route, queryParams: { id: this.steamId } }).toString();
            this.location.go(url);
            return this.steamId;
        }));
    }

    isValidId(idCheck: string): boolean {
        if (!idCheck) {
            return false;
        }
        try {
            const steamId = new SteamID(idCheck);
            return steamId.isValid();
        } catch (e) {
            return false;
        }
    }

    getCookiePermissions(): void {
        try {
            this.cookiesAllowed = JSON.parse(this.cookie.get('cookiePermission'));
        } catch (error) {
            delete this.cookiesAllowed;
        }
    }

    saveCookie(name: string, value: string): void {
        this.getCookiePermissions();
        if (!this.cookiesAllowed) {
            const ref = this.snackBar.openFromComponent(CookieSnackbarComponent, {
                verticalPosition: 'bottom'
            });
            ref.onAction().subscribe(() => {
                this.getCookiePermissions();
                if (this.cookiesAllowed && this.cookiesAllowed[name]) {
                    this.cookie.put(name, value);
                }
            });
            return;
        }
        const allowed = this.cookiesAllowed[name];
        if (allowed) {
            this.cookie.put(name, value);
        }
    }
}
