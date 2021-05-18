interface UserStats {
    steamid: string;
    playtime_forever: number;
    playtime_2weeks: number;
}

export interface Game {
    appid: string;
    name: string;
    img_icon_url: string;
    img_logo_url: string;
    userStats: UserStats[];
}
