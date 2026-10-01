import Image from "next/image";

import { Link } from "@/i18n/routing";

/*
 * Elexus — mahsulot kartasi (umumiy).
 * Figma: "продукты из наличия" (Frame 60) va "Акции и скидки" (Frame 67)
 * kartalari tuzilishi bir xil — farqi faqat rasm ustidagi belgida.
 * ─────────────────────────────────────────────────────────────────────────
 * TUZILMA (Figma):
 *   flex-col, ichki gap 12px
 *     nom   Inter Tight Medium · 14px · #222 · tracking -0.154px — YUQORIDA
 *     rasm  har gilamning o'z nisbati (qat'iy piksel emas)
 *       belgi (ixtiyoriy)  156×45 · #74301c · oq · UPPERCASE
 *                          matn chapdan 6px, tepadan 3px
 */

export type ProductCardData = {
  id: string;
  /** Karta ustidagi nom. */
  title: string;
  src: string;
  /** Rasmning o'z nisbati (en/balandlik), masalan "418/651". */
  aspect: string;
  href: string;
  /** Rasm ustidagi belgi (masalan "Скидка"). Berilmasa ko'rsatilmaydi. */
  badge?: string;
};

export default function ProductCard({
  item,
  sizes,
}: {
  item: ProductCardData;
  /** next/image uchun `sizes` — seksiya kolonkalariga qarab beriladi. */
  sizes: string;
}) {
  return (
    <Link href={item.href} className="group flex flex-col gap-[12px]">
      <span className="text-[14px] font-medium leading-[1.5] tracking-[-0.154px] text-[#222]">
        {item.title}
      </span>

      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: item.aspect }}
      >
        <Image
          src={item.src}
          alt={item.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Belgi rasm ichida, lekin zoom bilan kattalashmaydi — `scale`
              faqat <Image> da. Figma: matn markazda emas, tepaga yaqin
              (chapdan 6px, tepadan 3px) — dizayndagidek qoldirilgan. */}
        {item.badge && (
          <span className="absolute left-0 top-0 inline-block h-[45px] w-[156px] bg-[color:var(--elx-bg,#74301c)] pl-[6px] pt-[3px] text-[14px] font-medium uppercase leading-[normal] text-white">
            {item.badge}
          </span>
        )}
      </div>
    </Link>
  );
}
