import ElexusHeader from "@/components/elexus/header";
import CtaSection from "@/components/elexus/cta";
import FooterElexus from "@/components/elexus/footer";
import CatalogLayout from "@/components/elexus/catalog-layout";
import type { TenantShop } from "@/service/tenant-shop";

/**
 * Elexus Catalog page (Figma 276:17).
 *
 * Struktura:
 *   - Header (sticky)
 *   - CatalogLayout:
 *     • Left sidebar: Сортировка / Фильтр / Коллекции (fixed 360w)
 *     • Main: 3 ta product card (image chapda + details o'ngda)
 *     • Right panel: promo/banner (fixed 599w)
 *   - CTA banner
 *   - Footer
 */
type Props = {
  shop: TenantShop;
};

export default function CatalogElexus({ shop }: Props) {
  const brand = shop.title || "Elexus Hali";
  const phone = shop.phone || "90 123 45 67";
  const address = shop.address || "Uzbekistan, Tashkent, Aloqa, street 28";

  return (
    <div
      className="bg-white text-[#171717] antialiased"
      data-tenant={shop.slug}
    >
      <ElexusHeader shop={shop} />
      <CatalogLayout />
      <CtaSection />
      <FooterElexus phone={phone} address={address} brand={brand} />
    </div>
  );
}
