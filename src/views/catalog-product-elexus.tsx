import Header from "@/components/elexus/header";
import CatalogToolbar from "@/components/elexus/catalog-toolbar";
import CatalogProductDetail from "@/components/elexus/catalog-product-detail";
import PromoBannerSection from "@/components/elexus/promo-banner-section";
import Footer from "@/components/elexus/footer";
import type { CatalogCollection, CatalogProductVariant } from "@/data/catalog-elexus";
import type { TenantShop } from "@/service/tenant-shop";

/*
 * Elexus — Mahsulot sahifasi (/catalog/[collection]/[model]). Figma
 * frame 100:803. To'g'ridan-to'g'ri havola/SEO uchun — /catalog'dan karta
 * bosilganda esa navigatsiya YO'Q, xuddi shu kontent (CatalogProductDetail)
 * sahifa ichida View Transitions bilan chiqadi (qarang: catalog-listing.tsx).
 */

type Props = {
  shop: TenantShop;
  collection: CatalogCollection;
  product: CatalogProductVariant;
};

export default function CatalogProductElexus({ shop, collection, product }: Props) {
  return (
    <main className="min-h-screen bg-[#F4EFE9]" data-tenant={shop.slug}>
      <Header variant="light" />
      <CatalogToolbar />
      <CatalogProductDetail collection={collection} product={product} />
      <PromoBannerSection />
      <Footer />
    </main>
  );
}
