export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://gilam-market.uz';

export function absoluteUrl(path: string) {
    return `${SITE_URL}${path}`;
}
