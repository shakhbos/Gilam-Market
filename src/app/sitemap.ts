import { MetadataRoute } from 'next'
import { fetchData } from '@/service/get'
import { SITE_URL } from '@/utils/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const locales = ['uz', 'ru', 'en'];
    const baseRoutes = ['', '/about', '/delivery', '/payment'];

    const routes = locales.flatMap((locale) =>
        baseRoutes.map((route) => ({
            url: `${SITE_URL}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    );

    try {
        const products = await fetchData(`${process.env.NEXT_PUBLIC_URL}/qr-base/i-market`, {
            page: 1,
            limit: 1000,
            status: "published"
        });

        const productRoutes = products?.items?.flatMap((product: any) =>
            locales.map((locale) => ({
                url: `${SITE_URL}/${locale}/glam/${product.id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.6, // Slightly lower priority for individual products
            }))
        ) || [];

        return [...routes, ...productRoutes];
    } catch (error) {
        return routes;
    }
}
