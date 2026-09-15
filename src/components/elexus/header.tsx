import { User, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";

import type { TenantShop } from "@/service/tenant-shop";

/**
 * Figma burger — 3 ta parallel tayoqcha (24×2 px), 4 px vertikal bo'shliq
 * (Figma: bar 0px / 6px / 12px top offset; barlar 2px qalinlikda → 4px zazor).
 */
function BurgerIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex flex-col justify-between h-[14px] w-[24px]"
    >
      <span className="block h-[2px] w-[24px] bg-black" />
      <span className="block h-[2px] w-[24px] bg-black" />
      <span className="block h-[2px] w-[24px] bg-black" />
    </span>
  );
}

type Props = {
  shop: TenantShop;
};

/**
 * Elexus GIlam top navbar (Figma node 276:210).
 *
 * Struktura (Figma 1728px kanvas):
 *   ┌──────────────────────┬────────────────┬────────┬──────────┬──────┐
 *   │ Elexus GIlam (0-360) │ ☰ Gilam Kata.  │        │ AR-Sol.  │ 󱍄  󰋕  󰄔 │
 *   └──────────────────────┴────────────────┴────────┴──────────┴──────┘
 *
 * Cards:
 *   - Logo card: 360 wide, right-border (divider)
 *   - Burger + "Gilam Katalog": inline, 20px chapdan gap, 20px item gap
 *   - AR-Solishtirish: 165 wide, left-border
 *   - Icons: 216 wide, left-border, 3 ta icon 40px gap
 *
 * Typography (Figma):
 *   - Brand: 20px extrabold, uppercase, letter-spacing 2px
 *   - Menu / AR: 15px bold, letter-spacing -0.165px (SF Pro Display Bold)
 *   - Icons: 24×24
 *
 * Responsive (hech qanday item YO'QOLMAYDI, faqat textlar qisqaradi):
 *   - ≥1280 (xl / lg): to'liq Figma layout ("Gilam Katalog" · "AR-Solishtirish")
 *   - ≥768 (md): "Gilam Katalog" → "Katalog", "AR-Solishtirish" qoladi
 *   - <768 (sm/mobile): "Katalog" qoladi, "AR-Solishtirish" → "AR" (56-80px)
 */
export default function ElexusHeader({ shop: _shop }: Props) {
  // Brand headerda faqat "Elexus" ko'rsatiladi (shop.title metadata uchun
  // to'liq "Elexus Gilam" bo'lib qoladi — browser tab, SEO)
  const brand = "Elexus";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#F4F4F4]">
      <div className="flex h-[80px] items-stretch">
        {/* ── Chap tomon: Logo card (360w) + burger+menu ── */}
        {/* Logo card — right border divider (Figma Rectangle 61) */}
        <div className="flex items-center h-full pl-[24px] sm:pl-[40px] lg:w-[360px] lg:pl-[60px] lg:border-r lg:border-[#F4F4F4]">
          <Link
            href="/"
            className="whitespace-nowrap font-extrabold uppercase text-black text-[16px] tracking-[1.5px] leading-none sm:text-[18px] sm:tracking-[1.8px] lg:text-[20px] lg:tracking-[2px]"
          >
            {brand}
          </Link>
        </div>

        {/* Burger + Gilam Katalog — logodan keyingi seksiya (Figma Frame 31) */}
        <div className="flex items-center gap-[16px] sm:gap-[20px] pl-[12px] sm:pl-[20px] h-full">
          <button
            type="button"
            aria-label="Menu"
            className="inline-flex items-center justify-center text-black hover:opacity-70 transition-opacity shrink-0"
          >
            <BurgerIcon />
          </button>
          {/* Text ekran torayganda "Katalog" ga qisqaradi (Figma to'liq: "Gilam Katalog") */}
          <Link
            href="/catalog"
            className="whitespace-nowrap font-bold text-black text-[13px] sm:text-[15px] leading-none tracking-[-0.165px] hover:opacity-70 transition-opacity"
          >
            <span className="lg:hidden">Katalog</span>
            <span className="hidden lg:inline">Gilam Katalog</span>
          </Link>
        </div>

        {/* ── O'ng tomon: AR + Icons ── */}
        <div className="ml-auto flex items-stretch h-full">
          {/* AR-Solishtirish card — desktop'da 165w, kichrayganda width qisqaradi
              va text "AR" ga tushadi (yo'qotilmaydi) */}
          <Link
            href="/ar"
            className="inline-flex items-center justify-center h-full w-[56px] sm:w-[80px] md:w-[130px] lg:w-[165px] border-l border-[#F4F4F4] font-bold text-black text-[13px] lg:text-[15px] leading-none tracking-[-0.165px] whitespace-nowrap hover:bg-[#FAFAFA] transition-colors"
          >
            <span className="md:hidden">AR</span>
            <span className="hidden md:inline">AR-Solishtirish</span>
          </Link>

          {/* Icons card — desktop 216w (Figma Group 72), kichik ekranlarda
              icon o'lchamlari + gap qisqaradi (header siqilmasin) */}
          <div className="flex items-center justify-center gap-[12px] sm:gap-[20px] md:gap-[28px] lg:gap-[40px] h-full px-[12px] sm:px-[16px] md:px-[20px] lg:w-[216px] lg:px-0 border-l border-[#F4F4F4]">
            <Link
              href="/profile"
              aria-label="Profile"
              className="inline-flex text-black hover:opacity-70 transition-opacity"
            >
              <User className="size-[18px] sm:size-[20px] lg:size-[24px]" strokeWidth={1.75} />
            </Link>
            <Link
              href="/favorites"
              aria-label="Favorites"
              className="inline-flex text-black hover:opacity-70 transition-opacity"
            >
              <Heart className="size-[18px] sm:size-[20px] lg:size-[24px]" strokeWidth={1.75} />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="inline-flex text-black hover:opacity-70 transition-opacity"
            >
              <ShoppingCart className="size-[18px] sm:size-[20px] lg:size-[24px]" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
