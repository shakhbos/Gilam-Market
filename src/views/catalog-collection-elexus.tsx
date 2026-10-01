import Header from "@/components/elexus/header";
import CatalogToolbar from "@/components/elexus/catalog-toolbar";
import CatalogCollectionContent from "@/components/elexus/catalog-collection-content";
import PromoBannerSection from "@/components/elexus/promo-banner-section";
import Footer from "@/components/elexus/footer";
import type { CatalogCollection } from "@/data/catalog-elexus";
import type { TenantShop } from "@/service/tenant-shop";

/*
 * Elexus — Kolleksiya sahifasi (/catalog/[slug]). Figma frame 100:1388.
 * To'g'ridan-to'g'ri havola/SEO uchun — /catalog'dan "Посмотреть все"
 * bosilganda esa navigatsiya YO'Q, xuddi shu kontent (CatalogCollectionContent)
 * sahifa ichida animatsiya bilan chiqadi (qarang: catalog-listing.tsx).
 */

type Props = {
  shop: TenantShop;
  collection: CatalogCollection;
};

export default function CatalogCollectionElexus({ shop, collection }: Props) {
  return (
    <main className="min-h-screen bg-[#F4EFE9]" data-tenant={shop.slug}>
      <Header variant="light" />
      <CatalogToolbar />
      <CatalogCollectionContent collection={collection} />
      <PromoBannerSection />
      <Footer />
    </main>
  );
}
