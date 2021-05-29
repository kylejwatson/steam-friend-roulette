export interface Friend {
    steamid: string;
    personaname: string;
    personastate: number;
    communityvisibilitystate: number;
    profilestate: number;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    realname?: string;
    gameid?: string;
    selected?: boolean;
    element?: Element;
    lastlogoff: number;
    friend_since: number;
    loccountrycode?: string;
    timecreated?: number;
}
