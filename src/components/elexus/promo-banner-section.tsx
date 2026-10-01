import Image from "next/image";

import Container from "./container";

/*
 * Elexus — "Salon holati + CTA" banner qatori.
 * Figma frame 100:281 — node'lar YAGONA frame'ga guruhlanmagan (Rectangle 83,
 * 94, 410-415 va matn 100:426-429 — hammasi Frame 15 ning to'g'ridan-to'g'ri
 * bolalari). Shuning uchun bitta `data-node-id` yo'q, har element o'zinikini
 * ko'taradi.
 * ─────────────────────────────────────────────────────────────────────────
 * FIGMA O'LCHAMLARI (1920 freym, kontent 1720, chekka margin 100):
 *   ikkala karta ham y=5663, h=150, oq fon (#fff), burchak radiusi YO'Q
 *   (loyihada umuman border-radius ishlatilmaydi — bosh sahifaning boshqa
 *   barcha kartalarida ham shunday).
 *
 *   Karta 1 (ish vaqti)   x=534  w=418   → c4–c6   (Rectangle 83)
 *     100:427  sarlavha  "Салон закрыт · откроется в 9:00"  16px SemiBold #000
 *     100:429  matn      xuddi shu so'zlar, 14px #7E7C78 — Figma'da ikkalasi
 *              ham bor (aftidan holat matni ikki marta takrorlangan; ishlab
 *              chiqaruvchidan tasdiq kutilmoqda, hozircha aynan ko'rsatilgan).
 *
 *   Karta 2 (CTA)         x=968  w=661   → c7-boshlanadi (Rectangle 94)
 *     100:426  sarlavha  "Подарите интерьеру особенный характер"
 *     100:428  matn      "Выберите ковёр, который подчеркнёт стиль..."
 *
 *   Zinapoya rasm klasteri (Rectangle 410-415, faqat lg+):
 *     x=1640,1660,1690,1740  w=10,20,40,80 — har biri orasida 10px bo'shliq,
 *     kartaning o'ng chetidan tashqariga chiqib, kontentning o'ng chetigacha
 *     (x=1820) davom etadi. 4 ta gilam surati tor "zinapoya" ko'rinishida.
 *     Aniq qaysi rasm ekani Figma'da mavjud emas — saytdagi 4 ta demo
 *     mahsulot rasmi (Products/Discounts seksiyalari bilan bir xil) rang
 *     ohangiga yaqin tartibda ishlatilgan.
 *
 * PADDING — ANIQ o'lchangan (Figma bbox farqlari):
 *   Karta 1: matn x=588,y=5698 − karta x=534,y=5663 → pl=54px, pt=35px
 *   Karta 2: matn x=1026,y=5698 − karta x=968,y=5663 → pl=58px, pt=35px
 *   O'ngga padding YO'Q — matn shunchaki oqimda, karta kengligini
 *   to'ldirmaydi (Figma'da ham simmetrik emas).
 *
 * TIPOGRAFIYA (aniq bbox balandligidan hisoblangan):
 *   sarlavha  16px SemiBold UPPERCASE, bbox h=24 → leading 24/16=1.5
 *             (SectionTitle bilan bir xil: tracking -0.176px)
 *   matn      14px, bbox h=17 → leading 17/14≈1.214 ("normal", boshqa
 *             ikkinchi darajali matnlar — Reviews Fact, header pill'lari —
 *             bilan bir xil konventsiya)
 *   sarlavha↔matn oralig'i: 6px (5728 − (5698+24))
 *
 * KARTA 2 ↔ ZINAPOYA ORALIG'I: 11px (1640 − (968+661)).
 */

type Swatch = { src: string; alt: string; width: number };

/** Kenglik 10→20→40→80px — Figma zinapoyasi, kattadan kichikka emas, aksincha. */
const SWATCHES: readonly Swatch[] = [
  { src: "/elexus/product-hera-h43.png", alt: "", width: 10 },
  { src: "/elexus/product-aspendos-a378.png", alt: "", width: 20 },
  { src: "/elexus/product-tabriz-m472.png", alt: "", width: 40 },
  { src: "/elexus/product-anatoly-brenda07.png", alt: "", width: 80 },
];

export default function PromoBannerSection() {
  return (
    <section
      className="w-full bg-[#F4EFE9] pt-[60px]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
    >
      <Container>
        <div className="grid grid-cols-12 gap-x-[14px] gap-y-4">
          {/* Karta 1 — ish vaqti. c1-c3 bo'sh qoladi (Figma'da ham shunday). */}
          <div
            className="col-span-12 flex flex-col bg-white pl-[54px] pt-[35px] lg:col-span-3 lg:col-start-4 lg:h-[150px]"
            data-node-id="100:427"
          >
            <p className="text-[16px] font-semibold uppercase leading-[1.5] tracking-[-0.176px] text-black">
              Салон закрыт · откроется в 9:00
            </p>
            <p className="mt-[6px] text-[14px] leading-[normal] text-[#7E7C78]">
              Салон закрыт · откроется в 9:00
            </p>
          </div>

          {/* Karta 2 — CTA + zinapoya rasm klasteri. c7-c12. */}
          <div className="col-span-12 flex lg:col-span-6 lg:col-start-7 lg:h-[150px]">
            <div
              className="flex flex-1 flex-col bg-white pl-[58px] pt-[35px]"
              data-node-id="100:426"
            >
              <p className="text-[16px] font-semibold uppercase leading-[1.5] tracking-[-0.176px] text-black">
                Подарите интерьеру особенный характер
              </p>
              <p className="mt-[6px] max-w-[476px] text-[14px] leading-[normal] text-[#7E7C78]">
                Выберите ковёр, который подчеркнёт стиль вашего дома и создаст
                атмосферу настоящего уюта.
              </p>
            </div>

            <div
              className="hidden shrink-0 items-stretch gap-[10px] pl-[11px] lg:flex"
              aria-hidden="true"
            >
              {SWATCHES.map((s) => (
                <div
                  key={s.src}
                  className="relative h-full shrink-0 overflow-hidden"
                  style={{ width: s.width }}
                >
                  <Image src={s.src} alt={s.alt} fill sizes="80px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
