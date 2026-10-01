import ProductCard, { type ProductCardData } from "./product-card";
import Container from "./container";
import SectionTitle from "./section-title";

/*
 * Elexus — "Акции и скидки" seksiyasi.
 * Figma frame 100:281 · node 231:2581 (Frame 67).
 * ─────────────────────────────────────────────────────────────────────────
 * Tuzilishi "продукты из наличия" (Frame 60) bilan AYNAN bir xil — sarlavha,
 * 30px, keyin 4 ta karta c1/c4/c7/c10 da, tepadan tekislangan, balandliklari
 * har xil. Yagona farq: har rasm ustida "Скидка" belgisi (156×45, #74301c).
 * Shuning uchun karta <ProductCard> ga chiqarilgan, ikkala seksiya shuni
 * ishlatadi.
 *
 * Rasmlar boshqa — Figma'da bu seksiyada boshqa gilamlar (nomlari bir xil
 * bo'lsa ham).
 *
 * MA'LUMOT: hozircha Figma demo. Backend tayyor bo'lgach `items` propi
 * orqali almashtiriladi.
 */

const DEMO_ITEMS: readonly ProductCardData[] = [
  {
    id: "d-tabriz-m472",
    title: "Tabriz M472",
    src: "/elexus/discount-tabriz-m472.png",
    aspect: "418/651",
    href: "/catalog?q=Tabriz+M472",
    badge: "Скидка",
  },
  {
    id: "d-aspendos-a378",
    title: "Aspendos A378",
    src: "/elexus/discount-aspendos-a378.png",
    aspect: "417/597",
    href: "/catalog?q=Aspendos+A378",
    badge: "Скидка",
  },
  {
    id: "d-hera-h43",
    title: "Hera H43",
    src: "/elexus/discount-hera-h43.png",
    aspect: "419/535",
    href: "/catalog?q=Hera+H43",
    badge: "Скидка",
  },
  {
    id: "d-anatoly-brenda07",
    title: "Anatoly Brenda07",
    src: "/elexus/discount-anatoly-brenda07.png",
    aspect: "418/599",
    href: "/catalog?q=Anatoly+Brenda07",
    badge: "Скидка",
  },
];

export default function DiscountsSection({
  items = DEMO_ITEMS,
}: {
  items?: readonly ProductCardData[];
}) {
  return (
    <section
      className="w-full bg-[#F4EFE9] pt-[60px]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
      data-node-id="231:2581"
    >
      <Container>
        <div className="flex flex-col gap-[30px]">
          <SectionTitle href="/catalog?discount=1" nodeId="100:296">
            Акции и скидки
          </SectionTitle>

          <ul
            className="grid grid-cols-6 items-start gap-x-[14px] gap-y-10 lg:grid-cols-12"
            data-node-id="231:2571"
          >
            {items.map((item) => (
              <li key={item.id} className="col-span-6 md:col-span-3 lg:col-span-3">
                <ProductCard
                  item={item}
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
