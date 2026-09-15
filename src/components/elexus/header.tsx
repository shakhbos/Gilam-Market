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
 * Responsive:
 *   - ≥1280 (xl): to'liq Figma layout (logo card + burger+menu + AR + icons)
 *   - ≥768 (md): AR-Solishtirish qoladi, logo card border-r yashiriladi
 *   - <768: AR-Solishtirish yashirinadi, faqat brand + burger + "Gilam Katalog" + icons
 */
export default function ElexusHeader({ shop }: Props) {
  const brand = shop.title || "Elexus GIlam";

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
        <div className="flex items-center gap-[20px] pl-[16px] sm:pl-[20px] h-full">
          <button
            type="button"
            aria-label="Menu"
            className="inline-flex items-center justify-center text-black hover:opacity-70 transition-opacity shrink-0"
          >
            <BurgerIcon />
          </button>
          <Link
            href="/catalog"
            className="whitespace-nowrap font-bold text-black text-[15px] leading-none tracking-[-0.165px] hover:opacity-70 transition-opacity"
          >
            Gilam Katalog
          </Link>
        </div>

        {/* ── O'ng tomon: AR + Icons ── */}
        <div className="ml-auto flex items-stretch h-full">
          {/* AR-Solishtirish card (165w) — left border divider (Figma Group 57) */}
          <Link
            href="/ar"
            className="hidden md:inline-flex items-center justify-center h-full w-[130px] lg:w-[165px] border-l border-[#F4F4F4] font-bold text-black text-[13px] lg:text-[15px] leading-none tracking-[-0.165px] whitespace-nowrap hover:bg-[#FAFAFA] transition-colors"
          >
            AR-Solishtirish
          </Link>

          {/* Icons card (216w) — left border divider (Figma Group 72) */}
          <div className="flex items-center justify-center gap-[24px] sm:gap-[32px] lg:gap-[40px] h-full px-[24px] lg:w-[216px] lg:px-0 border-l border-[#F4F4F4]">
            <Link
              href="/profile"
              aria-label="Profile"
              className="inline-flex text-black hover:opacity-70 transition-opacity"
            >
              <User className="size-[24px]" strokeWidth={1.75} />
            </Link>
            <Link
              href="/favorites"
              aria-label="Favorites"
              className="inline-flex text-black hover:opacity-70 transition-opacity"
            >
              <Heart className="size-[24px]" strokeWidth={1.75} />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="inline-flex text-black hover:opacity-70 transition-opacity"
            >
              <ShoppingCart className="size-[24px]" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
