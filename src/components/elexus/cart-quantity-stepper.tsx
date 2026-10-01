"use client";

import { Minus, Plus } from "lucide-react";

/*
 * Elexus — Savat qatoridagi miqdor boshqaruvi. Figma 100:987-991: to'liq
 * to'q jigarrang (#74301c) pill, minus/son/plus. `CatalogQuantityPicker`
 * (mahsulot sahifasi) bilan bir xil ma'noda, lekin boshqa vizual naqsh —
 * u yerda matnli "• 1 шт" ro'yxati, bu yerda bitta pill ichida +/- tugma
 * (Figma ikkala sahifada ham ikkita alohida uslub ishlatgan).
 */
export default function CartQuantityStepper({
  quantity,
  max,
  onChange,
}: {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div
      className="flex h-[44px] w-[121px] items-center justify-between bg-[#74301c] px-[13px] text-[#f4efe9]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
    >
      <button
        type="button"
        aria-label="Kamaytirish"
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        className="transition-opacity duration-150 disabled:opacity-40"
      >
        <Minus size={16} strokeWidth={1.5} />
      </button>
      <span className="text-[16px] uppercase tracking-[-0.176px]">{quantity}</span>
      <button
        type="button"
        aria-label="Oshirish"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
        className="transition-opacity duration-150 disabled:opacity-40"
      >
        <Plus size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
