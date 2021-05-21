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
interface Category {
    id: number;
    description: string;
}
export interface GameDetails {
    name: string;
    steam_appid: string;
    is_free: boolean;
    detailed_description: string;
    short_description: string;
    about_the_game: string;
    header_image: string;
    categories: Category[];
}
