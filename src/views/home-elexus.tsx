import ElexusHeader from "@/components/elexus/header";
import HeroElexus from "@/components/elexus/hero";
import UslublarSection from "@/components/elexus/uslublar";
import AboutSection from "@/components/elexus/about";
import PortfolioSection from "@/components/elexus/portfolio";
import ProductsSection from "@/components/elexus/products";
import PromotionsSection from "@/components/elexus/promotions";
import TestimonialsSection from "@/components/elexus/testimonials";
import CtaSection from "@/components/elexus/cta";
import FooterElexus from "@/components/elexus/footer";
import type { TenantShop } from "@/service/tenant-shop";

/**
 * Elexus New Home page (Figma frame 333:711).
 *
 * Sahifa strukturasi:
 *   1. Header — sticky top navbar
 *   2. Hero — video/rasm fon + address/phone chapda + description/button o'ngda
 *   3. USLUBLAR — 5 karta karusel
 *   4. Мы ради работать в вашем уюте — 3 kolonka (sarlavha + 2 paragraph)
 *   5. Наше портфолио — 1608×600 panoramic rasm
 *   6. ПРОДУКТЫ (HERA LUXURY) — sarlavha panel + 3 karta grid
 *   7. Акции и скидки — sarlavha panel + 3 karta grid + Загрузить ещё
 *   8. Что говорят о нас — sarlavha + 3 testimonial karta
 *   9. CTA — "Подарите интерьеру особенный характер" band
 *   10. Footer — 5 kolonka (brand+social + 4 link kolonkasi)
 */
type Props = {
  shop: TenantShop;
};

export default function HomeElexus({ shop }: Props) {
  const brand = shop.title || "Elexus Hali";
  const phone = shop.phone || "90 123 45 67";
  const address = shop.address || "Uzbekistan, Tashkent, Aloqa, street 28";

  return (
    <div
      className="bg-white text-[#171717] antialiased"
      data-tenant={shop.slug}
    >
      <ElexusHeader shop={shop} />
      <HeroElexus phone={phone} address={address} />
      <UslublarSection />
      <AboutSection />
      <PortfolioSection />
      <ProductsSection />
      <PromotionsSection />
      <TestimonialsSection />
      <CtaSection />
      <FooterElexus phone={phone} address={address} brand={brand} />
    </div>
  );
}
