import Image from "next/image";

import Container from "./container";
import SectionTitle from "./section-title";
import { Link } from "@/i18n/routing";

/*
 * Elexus — "Выберитие ковров по типу ремонта" seksiyasi.
 * Figma frame 100:281 · node 231:2580 (Frame 66).
 * ─────────────────────────────────────────────────────────────────────────
 * FIGMA O'LCHAMLARI (1920 freym, kontent 1720, chekka margin 100):
 *   Frame 66   x=100  y=1000  w=1718  h=461   ichki gap 30px
 *     sarlavha  h=17   Inter Tight SemiBold · 14px · #000 · UPPERCASE
 *     Frame 54  y=47   6 ta karta, oralig'i 16px
 *       karta   273×414, ichki gap 7px
 *         rasm  273×390
 *         nom   14px · Inter Tight Regular · #a5a5a5
 *
 * GRID:
 *   Kartalar x = 0, 289, 578, 867, 1156, 1445 — bu 12-kolonkali grid'ning
 *   c1, c3, c5, c7, c9, c11 chiziqlari (qadam 144.5 × 2 = 289). Ya'ni har
 *   karta roppa-rosa 2 kolonka, oltitasi 12 kolonkani to'ldiradi.
 *   Shuning uchun flex emas, sahifaning umumiy grid'i ishlatiladi —
 *   header va hero bilan bir xil ustunlarga tushadi.
 *   (Figma'da karta eni 273 + gap 16 = 289; grid'da 275 + gutter 14 = 289 —
 *   bir xil ritm, 2px farq ko'zga tashlanmaydi.)
 *
 * FON:
 *   Hero jigarrang bandi y=940 da tugaydi, undan keyingi sahifa krem
 *   (#F4EFE9). Shuning uchun fon shu seksiyada boshlanadi.
 *   Yuqoridagi 60px — Figma: hero foni 940, sarlavha 1000.
 *
 * RASM NISBATI:
 *   273×390 → 0.7:1. `object-cover` ishlatiladi: Figma'da har rasm o'z
 *   kadriga kesilgan, `cover` esa istalgan kenglikda shu kadrni saqlaydi.
 */

type StyleCard = {
  /** Karta ostidagi nom (Figma matni). */
  title: string;
  src: string;
  /** Katalogdagi mos filtr — hozircha havola sifatida. */
  href: string;
};

const STYLES: readonly StyleCard[] = [
  { title: "Минимализм", src: "/elexus/style-minimalizm.png", href: "/catalog?style=minimalizm" },
  { title: "Неоклассика", src: "/elexus/style-neoklassika.png", href: "/catalog?style=neoklassika" },
  { title: "Классика", src: "/elexus/style-klassika.png", href: "/catalog?style=klassika" },
  { title: "Восточный", src: "/elexus/style-sharqona.png", href: "/catalog?style=sharqona" },
  { title: "Лофт", src: "/elexus/style-loft.png", href: "/catalog?style=loft" },
  { title: "Ар-деко", src: "/elexus/style-ar-deko.png", href: "/catalog?style=ar-deko" },
];

export default function StylesSection() {
  return (
    <section
      className="w-full bg-[#F4EFE9] pt-[60px]"
      // Butun seksiya Inter Tight — sarlavha ham, karta nomlari ham
      // (Figma: SemiBold sarlavha, Regular nomlar).
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
      data-node-id="231:2580"
    >
      <Container>
        {/* Figma: sarlavha bilan kartalar orasida 30px. */}
        <div className="flex flex-col gap-[30px]">
          <SectionTitle href="/catalog" nodeId="100:431">
            Выберитие ковров по типу ремонта
          </SectionTitle>

          {/* Har karta 2 kolonka → oltitasi 12 kolonkani to'ldiradi.
                Tor ekranda kolonka soni kamayadi: 6 → 3 → 2. */}
          <ul
            className="grid grid-cols-4 gap-x-[14px] gap-y-8 md:grid-cols-6 lg:grid-cols-12"
            data-node-id="231:2520"
          >
            {STYLES.map((s) => (
              <li key={s.title} className="col-span-2">
                {/* Figma: rasm bilan nom orasida 7px. */}
                <Link href={s.href} className="group flex flex-col gap-[7px]">
                  <div className="relative aspect-[273/390] w-full overflow-hidden">
                    <Image
                      src={s.src}
                      alt={s.title}
                      fill
                      sizes="(min-width: 1024px) 17vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <span className="text-[14px] text-[#a5a5a5] transition-colors duration-150 group-hover:text-black">
                    {s.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
