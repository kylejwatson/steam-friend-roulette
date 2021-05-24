import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

export class SteamIdParam {
    steamId = '';

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected cookie: CookieService,
        protected location: Location,
        protected snackBar: MatSnackBar
    ) { }

    getSteamId(finished?: () => void, notFound?: () => void): void {
        this.route.queryParamMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.steamId = id;
                this.cookie.put('steamid', id);
            } else {
                this.steamId = this.cookie.get('steamid');
                const url = this.router.createUrlTree([], { relativeTo: this.route, queryParams: { id: this.steamId } }).toString();
                this.location.go(url);
            }

            if (finished && this.steamId) {
                finished();
            } else if (notFound && !this.steamId) {
                this.snackBar.open('Please enter your Steam ID first', 'Close', {
                    duration: 3000,
                    verticalPosition: 'top'
                });
                notFound();
            }
        });
    }
}
