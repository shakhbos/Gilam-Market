import CatalogProductTile from "./catalog-product-tile";
import type { CatalogCollection, CatalogProductVariant } from "@/data/catalog-elexus";

/*
 * Elexus — Kolleksiya sahifasidagi mahsulot to'ri (barcha modellar).
 * Figma frame 100:1388, node Rectangle 95/96/97/98/99/100 (2 ustun, N qator).
 * Har katak — CatalogProductTile (ro'yxat qatori bilan bir xil komponent).
 *
 * FIGMA O'LCHAMLARI: ustunlar orasi 16px (catalog qatoridagi bilan bir
 * xil), QATORLAR orasi 21px (Figma: 1019−184−814=21) — ro'yxat
 * sahifasidagi 100px'dan farqli, chunki bu yerda bitta uzluksiz to'r.
 *
 * `animateIn` — "Посмотреть все" bosilib, bu to'r sahifa ichida (navigatsiyasiz)
 * paydo bo'lganda har katak pastdan "suzib" chiqadi (opacity+translateY),
 * ketma-ket (stagger, 60ms qadam) — catalog-listing.tsx shu holatda beradi.
 * Oddiy /catalog/[slug] sahifa yuklanishida (hard navigation) esa kerak
 * emas — shuning uchun ixtiyoriy prop.
 */
export default function CatalogCollectionGrid({
  collection,
  products,
  animateIn = false,
  onOpenProduct,
}: {
  collection: CatalogCollection;
  products: readonly CatalogProductVariant[];
  animateIn?: boolean;
  onOpenProduct?: (product: CatalogProductVariant) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-[16px] gap-y-[21px]">
      {products.map((p, i) => (
        <div
          key={p.id}
          className={animateIn ? "animate-elx-rise" : undefined}
          style={animateIn ? { animationDelay: `${i * 60}ms` } : undefined}
        >
          <CatalogProductTile product={p} collection={collection} onOpen={onOpenProduct} />
        </div>
      ))}
    </div>
  );
}
