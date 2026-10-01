"use client";

import Image from "next/image";
import { X } from "lucide-react";

import CartQuantityStepper from "./cart-quantity-stepper";
import { getCatalogCollection, type CatalogCollection } from "@/data/catalog-elexus";
import { formatSumElexus } from "@/utils/format-sum-elexus";
import { parseSizeAreaSqm, formatAreaSqm } from "@/utils/elexus-cart";
import { useAppDispatch } from "@/lib/hooks";
import {
  removeElexusCartItem,
  setElexusCartQuantity,
  type ElexusCartItem,
} from "@/lib/features/cart-elexus/cart-elexus-slice";

/** Collection'ning `detailSpecs`idan bitta matnli qiymatni topadi. */
function specValue(collection: CatalogCollection, label: string): string {
  const entry = collection.detailSpecs.find((s) => s.label === label);
  return typeof entry?.value === "string" ? entry.value : "";
}

/*
 * Elexus — savat qatori. Figma 100:979-1004 (har qator 400px baland,
 * pastki chiziq #dcd8d2, birinchi qatorda ustki chiziq ham bor).
 * Spec qatorlari (o'lcham/material/zichlik/kelib chiqishi) saqlanmaydi —
 * `collectionSlug`+`productId` orqali `catalog-elexus.ts`dan render
 * vaqtida qayta olinadi (CartItem — faqat tanlov+narx snapshot).
 */
export default function CartItemRow({
  item,
  index,
}: {
  item: ElexusCartItem;
  index: number;
}) {
  const dispatch = useAppDispatch();
  const collection = getCatalogCollection(item.collectionSlug);
  const product = collection?.products.find((p) => p.id === item.productId);
  if (!collection || !product) return null;

  const area = parseSizeAreaSqm(item.size);
  const specLines = [
    `${item.size} см · ${formatAreaSqm(area)} м²`,
    specValue(collection, "Материал"),
    `${specValue(collection, "Плотность")} · ворс ${specValue(collection, "Высота ворса")}`,
    specValue(collection, "Происхождение"),
  ];

  return (
    <div className="grid grid-cols-12 items-start gap-x-[14px] gap-y-6 border-b border-[#dcd8d2] py-[31px] first:border-t">
      <p className="col-span-2 text-[16px] uppercase leading-[1.5] tracking-[-0.176px] text-black lg:col-span-1">
        {String(index + 1).padStart(2, "0")}
      </p>

      <div className="relative col-span-4 aspect-[273/357] w-full overflow-hidden lg:col-span-2 lg:col-start-2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 273px, 30vw"
          className="object-cover"
        />
      </div>

      <div className="col-span-6 lg:col-span-2 lg:col-start-4">
        <p className="text-[22px] leading-[1.5] tracking-[-0.242px] text-black">
          {product.modelTitle}
        </p>
        <div className="mt-[5px] flex flex-col text-[14px] leading-[21px] text-[#7E7C78]">
          {specLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-[20px] text-[14px] leading-[21px] text-[#393735]">
          {formatSumElexus(item.pricePerUnit)} сум за ковёр
        </p>
      </div>

      <div className="col-span-8 lg:col-span-2 lg:col-start-9">
        <CartQuantityStepper
          quantity={item.quantity}
          max={item.maxQuantity}
          onChange={(quantity) => dispatch(setElexusCartQuantity({ id: item.id, quantity }))}
        />
      </div>

      <button
        type="button"
        aria-label="O'chirish"
        onClick={() => dispatch(removeElexusCartItem({ id: item.id }))}
        className="col-span-4 col-start-9 justify-self-end text-black transition-opacity duration-150 hover:opacity-60 lg:col-span-1 lg:col-start-12"
      >
        <X size={24} strokeWidth={1.25} />
      </button>
    </div>
  );
}
