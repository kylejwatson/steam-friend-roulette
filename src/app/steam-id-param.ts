import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import * as SteamID from 'steamid';

export class SteamIdParam {
    steamId = '';

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
                        duration: 3000,
                        verticalPosition: 'top'
                    });
                    this.router.navigate(['/steam-id'], { queryParams: { id: this.steamId } });
                    return '';
                }
                this.cookie.put('steamid', this.steamId);
                return this.steamId;
            }
            this.steamId = this.cookie.get('steamid');
            const url = this.router.createUrlTree([], { relativeTo: this.route, queryParams: { id: this.steamId } }).toString();
            this.location.go(url);

            if (!this.steamId) {
                this.snackBar.open('Please enter your Steam ID first', 'Close', {
                    duration: 3000,
                    verticalPosition: 'top'
                });
            }

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
}
