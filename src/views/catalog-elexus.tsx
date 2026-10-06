import Header from "@/components/elexus/header";
import CatalogToolbar from "@/components/elexus/catalog-toolbar";
import CatalogListing from "@/components/elexus/catalog-listing";
import PromoBannerSection from "@/components/elexus/promo-banner-section";
import Footer from "@/components/elexus/footer";
import { buildCatalogCollections } from "@/data/catalog-adapter";
import { pickRandomProducts } from "@/data/catalog-elexus";
import { fetchCatalogGroups } from "@/service/catalog-public";
import type { TenantShop } from "@/service/tenant-shop";

/*
 * Elexus Catalog — Figma frame 100:625.
 * Header "light" variantda (bu sahifada hero yo'q, fon krem #F4EFE9 —
 * home-elexus.tsx'dagi jigarrang hero fonidan farqli, Group24 y=0'da,
 * 20px tepa bo'shliqsiz).
 *
 * Har qator — bitta KOLLEKSIYA (src/data/catalog-elexus.ts). Ko'rsatiladigan
 * 2 rasm — tasodifiy tanlangan modellar (`pickRandomProducts`, SERVER
 * component'da bir marta — hydration mos kelmasligi yo'q). Natija
 * `CatalogListing`ga (client) beriladi — u "Посмотреть все" bosilganda
 * sahifa ichida (navigatsiyasiz) kolleksiyaning to'liq to'rini animatsiya
 * bilan ochadi.
 */

type Props = {
  shop: TenantShop;
};

export default async function CatalogElexus({ shop }: Props) {
  const groups = await fetchCatalogGroups(shop.slug);
  const collections = buildCatalogCollections(groups).map((collection) => ({
    collection,
    preview: pickRandomProducts(collection.products, 2),
  }));

  return (
    <main className="min-h-screen bg-[#F4EFE9]" data-tenant={shop.slug}>
      <Header variant="light" />
      <CatalogToolbar />
      <CatalogListing collections={collections} />
      <PromoBannerSection />
      <Footer />
    </main>
  );
}
