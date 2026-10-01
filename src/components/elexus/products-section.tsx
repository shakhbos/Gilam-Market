import ProductCard, { type ProductCardData } from "./product-card";
import Container from "./container";
import SectionTitle from "./section-title";

/*
 * Elexus — "продукты из наличия" seksiyasi.
 * Figma frame 100:281 · node 231:2550 (Frame 60).
 * ─────────────────────────────────────────────────────────────────────────
 * FIGMA O'LCHAMLARI (1920 freym, kontent 1720, chekka margin 100):
 *   Frame 60   x=100  y=1521  w=1720   ichki gap 30px
 *     sarlavha  Inter Tight SemiBold · 16px · #222 · UPPERCASE
 *     Frame 59  y=54  kartalar qatori, gap 16px, items-start
 *       karta   ichki gap 12px — NOM RASMDAN YUQORIDA
 *         nom   Inter Tight Medium · 14px · #222 · tracking -0.154px
 *         rasm  balandligi har xil
 *
 *   Kartalar:  x=0    w=418  rasm 651   Tabriz M472
 *              x=434  w=417  rasm 597   Aspendos A378
 *              x=867  w=419  rasm 535   Hera H43
 *              x=1302 w=418  rasm 599   Anatoly Brenda07
 *
 * GRID:
 *   x = 0, 434, 867, 1302 → 12-kolonkali grid'ning c1, c4, c7, c10
 *   (qadam 144.5 × 3 = 433.5). Har karta 3 kolonka, to'rttasi 12 ni to'ldiradi.
 *
 * BALANDLIK:
 *   Har gilamning o'z nisbati bor (0.642 / 0.698 / 0.783 / 0.698) va Figma
 *   kartalarni TEPADAN tekislaydi (`items-start`), pastdan emas. Shuning
 *   uchun balandlik qat'iy piksel emas, har kartaning o'z `aspect-ratio`si —
 *   kenglik o'zgarganda nisbat saqlanadi.
 *
 * MA'LUMOT:
 *   Hozircha Figma demo ma'lumoti. Backend tayyor bo'lgach `products` propi
 *   orqali almashtiriladi — komponent butunlay ma'lumotga asoslangan.
 */

const DEMO_PRODUCTS: readonly ProductCardData[] = [
  {
    id: "tabriz-m472",
    title: "Tabriz M472",
    src: "/elexus/product-tabriz-m472.png",
    aspect: "418/651",
    href: "/catalog?q=Tabriz+M472",
  },
  {
    id: "aspendos-a378",
    title: "Aspendos A378",
    src: "/elexus/product-aspendos-a378.png",
    aspect: "417/597",
    href: "/catalog?q=Aspendos+A378",
  },
  {
    id: "hera-h43",
    title: "Hera H43",
    src: "/elexus/product-hera-h43.png",
    aspect: "419/535",
    href: "/catalog?q=Hera+H43",
  },
  {
    id: "anatoly-brenda07",
    title: "Anatoly Brenda07",
    src: "/elexus/product-anatoly-brenda07.png",
    aspect: "418/599",
    href: "/catalog?q=Anatoly+Brenda07",
  },
];

export default function ProductsSection({
  products = DEMO_PRODUCTS,
}: {
  products?: readonly ProductCardData[];
}) {
  return (
    <section
      className="w-full bg-[#F4EFE9] pt-[60px]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
      data-node-id="231:2550"
    >
      <Container>
        {/* Figma: sarlavha bilan kartalar orasida 30px. */}
        <div className="flex flex-col gap-[30px]">
          <SectionTitle href="/catalog" nodeId="100:295">
            Продукты из наличия
          </SectionTitle>

          {/* Har karta 3 kolonka → to'rttasi 12 kolonkani to'ldiradi.
                `items-start`: kartalar tepadan tekislanadi, balandliklari
                har xil bo'lib qolaveradi (Figma'dagidek).
                Tor ekranda: 4 → 2 → 1 ta. */}
          <ul
            className="grid grid-cols-6 items-start gap-x-[14px] gap-y-10 md:grid-cols-6 lg:grid-cols-12"
            data-node-id="231:2549"
          >
            {products.map((p) => (
              <li key={p.id} className="col-span-6 md:col-span-3 lg:col-span-3">
                <ProductCard
                  item={p}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
