export interface CookieSettings {
    [key: string]: boolean;
    steamId: boolean;
    friendSelection: boolean;
    session: boolean;
    cookiePermission: boolean;
}

export const defaultValues: CookieSettings = {
    steamId: true,
    friendSelection: true,
    session: true,
    cookiePermission: true,
};
