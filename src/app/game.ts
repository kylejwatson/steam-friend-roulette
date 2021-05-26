export interface UserStats {
    steamId: string;
    playtime_forever: number;
    playtime_2weeks: number;
}

export interface Game {
    appid: number;
    name: string;
    img_icon_url: string;
    img_logo_url: string;
    userStats: UserStats[];
}
export interface Category {
    id: number;
    description: string;
    icon?: string;
    checked?: boolean;
    subcategories?: Category[];
}
export interface Genre {
    id: number;
    description: string;
}
export interface GameDetails {
    name: string;
    steam_appid: number;
    is_free: boolean;
    detailed_description: string;
    short_description: string;
    about_the_game: string;
    header_image: string;
    categories: Category[];
    genres: Genre[];
}

export const categories: Category[] = [
    {
        id: 2,
        description: 'Single-player',
        checked: true,
        icon: 'person_outline'
    },
    {
        id: 1,
        description: 'Multi-player',
        checked: true,
        icon: 'groups',
        subcategories: [
            {
                id: 49,
                description: 'PvP',
                checked: true,
                subcategories: [
                    {
                        id: 36,
                        description: 'Online PvP',
                        checked: true
                    },
                    {
                        id: 47,
                        description: 'LAN PvP',
                        checked: true
                    }
                ]
            },
            {
                id: 9,
                description: 'Co-op',
                checked: true,
                subcategories: [
                    {
                        id: 38,
                        description: 'Online Co-op',
                        checked: true
                    },
                    {
                        id: 48,
                        description: 'LAN Co-op',
                        checked: true
                    }

                ]
            },
            {
                id: 20,
                description: 'MMO',
                checked: true
            }
        ]
    }
];
