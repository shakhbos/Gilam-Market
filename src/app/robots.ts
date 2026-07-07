import { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/seo';

/**
 * Crawl siyosati. Static katalog va mahsulot sahifalari to'liq indekslanadi;
 * foydalanuvchiga xos yo'llar (profil, checkout) bloklanadi — ular
 * autentifikatsiya talab qiladi va noyob kontent bermaydi.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/*/profile/',
                    '/*/order',
                    '/api/',
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
