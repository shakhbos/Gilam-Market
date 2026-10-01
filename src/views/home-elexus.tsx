import Header from "@/components/elexus/header";
import Hero from "@/components/elexus/hero";
import StylesSection from "@/components/elexus/styles-section";
import ProductsSection from "@/components/elexus/products-section";
import DiscountsSection from "@/components/elexus/discounts-section";
import AboutSection from "@/components/elexus/about-section";
import PortfolioSection from "@/components/elexus/portfolio-section";
import ReviewsSection from "@/components/elexus/reviews-section";
import PromoBannerSection from "@/components/elexus/promo-banner-section";
import Footer from "@/components/elexus/footer";
import type { TenantShop } from "@/service/tenant-shop";

/**
 * Elexus home — barcha 9 seksiya + footer (Figma frame 100:281 to'liq).
 *
 * Diqqat: Header `sticky` — u faqat SHU <main> ichida qotib turadi.
 * Yangi bo'limlar ham shu <main> ichida bo'lishi shart, aks holda
 * scroll paytida header ular ustida qolmaydi.
 *
 * TEPADAGI 20px (`pt-5`):
 *   Figma'da bar tepadan 20px pastda boshlanadi (Rectangle 56, y=20).
 *   Bu bo'shliq ataylab <main> da, Header ichida EMAS: header'dan tashqarida
 *   bo'lgani uchun scroll paytida yo'qoladi va header top:0 ga taqalib
 *   qotadi. Agar bo'shliq sticky element ichida bo'lsa — hech qachon
 *   yo'qolmaydi va header qimirlamay qolar edi.
 *
 * RANG — bitta manba (`--elx-bg`):
 *   Sahifa foni, header bar'i va avatar paneli SHU o'zgaruvchini ishlatadi.
 *   Shuning uchun rang bir joyda o'zgartirilsa, uchalasi birga o'zgaradi —
 *   avatar paneli har doim sayt foni bilan bir xil bo'lib qoladi.
 *
 *   Hozircha qiymat Figma'dan (#5E2C1A). Tenant rangiga ulash bir qator:
 *   `shop.primaryColor` — lekin Elexus DB'sida u `#1A1A1A` (deyarli qora),
 *   ya'ni dizayndagi jigarrang emas. DB'da rang to'g'rilangach ulash mumkin.
 */
type Props = {
  shop: TenantShop;
};

/** Elexus yuza rangi — Figma (hero foni 100:282, header bar 100:451,
 *  avatar paneli 100:314, «О нас» paneli 240:2598 — hammasi shu rang). */
const ELEXUS_BG = "#74301c";

export default function HomeElexus({ shop }: Props) {
  return (
    <main
      className="min-h-screen bg-[color:var(--elx-bg,#74301c)] pt-5 antialiased"
      style={{ ["--elx-bg" as string]: ELEXUS_BG }}
      data-tenant={shop.slug}
    >
      <Header />
      <Hero />

      {/* Hero'dan keyingi birinchi seksiya — bu yerdan sahifa fon rangi
            krem (#F4EFE9) ga o'tadi (Figma: jigarrang hero bandi y=940 da
            tugaydi). */}
      <StylesSection />
      <ProductsSection />
      <DiscountsSection />
      <AboutSection />
      {/* «О нас» ning pastki padding'i YO'Q — Figma'dagi 100px shu
            seksiyaning `pt-[100px]` ida, bitta joyda. */}
      <PortfolioSection />
      <ReviewsSection />
      <PromoBannerSection />
      <Footer />
    </main>
  );
}
