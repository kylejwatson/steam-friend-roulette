import { ActivatedRoute } from '@angular/router';

export class SteamIdParam {
    steamId = '';

    constructor(
        protected route: ActivatedRoute,
    ) { }

    getSteamId(finished?: () => void, notFound?: () => void): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.steamId = id;
                if (finished) {
                    finished();
                }
            } else if (notFound) {
                notFound();
            }
        });
    }
}
