import { MetadataRoute } from 'next';
import { fetchData } from '@/service/get';
import { SITE_URL } from '@/utils/seo';
import type { PaginatedResponse, QrBaseProduct } from '@/types/api';

const LOCALES = ['uz', 'ru', 'en'] as const;
const BASE_ROUTES = ['', '/about', '/delivery', '/payment'] as const;

/**
 * Sitemap. Barcha statik sahifalar + katalogdagi barcha published mahsulotlar.
 * Har mahsulot 3 ta locale versiyasida ro'yxatga tushadi.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseSitemap: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
        BASE_ROUTES.map((route) => ({
            url: `${SITE_URL}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        })),
    );

    const products = await fetchData<PaginatedResponse<QrBaseProduct>>(
        `${process.env.NEXT_PUBLIC_URL}/qr-base/i-market`,
        { page: 1, limit: 1000, status: 'published' },
        // Sitemap uzoq muddatga kesh — soatiga bir marta yangilanadi.
        { cache: 'force-cache', next: { revalidate: 3600 } },
    );

    if (!products?.items?.length) return baseSitemap;

    const productSitemap: MetadataRoute.Sitemap = products.items.flatMap((p) =>
        LOCALES.map((locale) => ({
            url: `${SITE_URL}/${locale}/glam/${p.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        })),
    );

    return [...baseSitemap, ...productSitemap];
}
