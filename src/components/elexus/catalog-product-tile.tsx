"use client";

import Image from "next/image";

import {
  productImageTransitionName,
  type CatalogCollection,
  type CatalogProductVariant,
} from "@/data/catalog-elexus";
import { useAppDispatch } from "@/lib/hooks";
import { addElexusCartItem } from "@/lib/features";
import { sizeAreaM2 } from "@/utils/size-area";

/*
 * Elexus — Catalog mahsulot katagi. Ro'yxat qatorida (2 model) va kolleksiya
 * sahifasida (barcha modellar) BIR XIL komponent ishlatiladi.
 * ─────────────────────────────────────────────────────────────────────────
 * YORLIQ — faqat MODEL nomi (`product.modelTitle`, masalan o'lcham),
 * kolleksiya nomi EMAS — u sidebar'da bitta marta (fixed) ko'rsatiladi,
 * kartada takrorlash ortiqcha. 16px, QORA, chapdan 20px / pastdan 24px.
 * SKU (`n°...`) kartada ko'rsatilmaydi — `product.sku`/`name` hali ham
 * rasm `alt`i va mahsulot sahifasi uchun saqlanadi.
 * HOVER — rasm ProductCard bilan bir xil zumlanadi (scale 1.03, 500ms).
 * "ДОБАВИТЬ В КОРЗИНУ" — pastki-o'ng, 10px/10px inset, hover'da ohista
 * (300ms, opacity + kichik translate-y) paydo bo'ladi. Karta `product`
 * sahifasidagi kabi o'lcham/miqdor tanlagichiga EGA EMAS — shuning uchun
 * sukut qiymatlar bilan savatga qo'shadi: `collection.sizes[0]` (1-o'lcham)
 * va miqdor 1 — xuddi mahsulot sahifasi ochilgan zahoti bo'ladigan sukut
 * holat bilan bir xil. `<span role="button">` (haqiqiy `<button>` EMAS) —
 * chunki bu element ALLAQACHON tashqi `<button>` (butun karta) ICHIDA,
 * HTML'da button ichida button bo'lishi mumkin emas. `stopPropagation` —
 * shu tugma bosilganda karta ham "ochilib" ketmasin (onOpen chaqirilmasin).
 *
 * BOSISH (kartaning qolgan qismi) — butun karta (rasm) bosiladigan: `onOpen`
 * berilsa (catalog-listing.tsx shu orqali View Transitions bilan mahsulot
 * sahifasini ochadi — rasm SHU JOYDA turib kattalashadi, navigatsiya
 * sezilmaydi). `view-transition-name` shu maqsadda — mahsulot sahifasidagi
 * hero rasm bilan BIR XIL nom.
 */
export default function CatalogProductTile({
  product,
  collection,
  onOpen,
}: {
  product: CatalogProductVariant;
  collection: CatalogCollection;
  onOpen?: (product: CatalogProductVariant) => void;
}) {
  const dispatch = useAppDispatch();

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    const size = collection.sizes[0];
    dispatch(
      addElexusCartItem({
        collectionSlug: collection.slug,
        productId: product.id,
        size,
        // `collection.price` — Narx(so'm/м²), umumiy narx EMAS — qarang
        // catalog-product-detail.tsx'dagi bir xil hisob.
        pricePerUnit: Math.round(collection.price * sizeAreaM2(size)),
        maxQuantity: collection.maxQuantity,
        quantity: 1,
      }),
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen ? () => onOpen(product) : undefined}
      className="group relative block aspect-[630/814] w-full overflow-hidden text-left"
    >
      <div
        className="absolute inset-0"
        style={{ viewTransitionName: productImageTransitionName(product.id) }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 37vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <p className="pointer-events-none absolute bottom-6 left-5 text-[16px] font-semibold uppercase leading-[1.2] tracking-[-0.176px] text-black">
        {product.modelTitle}
      </p>

      <span
        role="button"
        tabIndex={-1}
        onClick={handleQuickAdd}
        className="absolute bottom-2.5 right-2.5 h-[45px] translate-y-1 bg-white px-[15px] text-[14px] font-semibold uppercase text-black opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 flex items-center"
      >
        Добавить в корзину
      </span>
    </button>
  );
}
