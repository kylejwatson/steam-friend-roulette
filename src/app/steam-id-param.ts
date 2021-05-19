import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Location } from '@angular/common';

export class SteamIdParam {
    steamId = '';

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected cookie: CookieService,
        protected location: Location
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
                notFound();
            }
        });
    }
}
