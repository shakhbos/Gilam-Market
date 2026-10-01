import Header from "@/components/elexus/header";
import Footer from "@/components/elexus/footer";
import Container from "@/components/elexus/container";
import CartHeading from "@/components/elexus/cart-heading";
import CartListing from "@/components/elexus/cart-listing";
import CartSummaryBar from "@/components/elexus/cart-summary-bar";
import type { TenantShop } from "@/service/tenant-shop";

/*
 * Elexus — Savat sahifasi (/cart). Figma frame 100:931.
 * Header "light" variantda (xuddi /catalog kabi) — lekin CatalogToolbar
 * YO'Q, bu sahifada "Каталог" sticky pastki sarlavha emas, faqat
 * "// Корзина" oddiy oqimda. PromoBannerSection ham yo'q (Figma'da bu
 * sahifada promo banner yo'q — CTA bar'dan keyin to'g'ridan-to'g'ri Footer).
 */
type Props = {
  shop: TenantShop;
};

export default function CartElexus({ shop }: Props) {
  return (
    <main className="min-h-screen bg-[#F4EFE9]" data-tenant={shop.slug}>
      <Header variant="light" />
      <Container>
        <div className="pt-[35px] pb-[100px]">
          <CartHeading />
          <CartListing />
          <CartSummaryBar />
        </div>
      </Container>
      <Footer />
    </main>
  );
}
