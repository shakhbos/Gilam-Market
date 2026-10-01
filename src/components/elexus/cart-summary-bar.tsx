"use client";

import { useState } from "react";

import { useAppSelector } from "@/lib/hooks";
import { useMounted } from "@/hooks/use-mounted";
import { formatSumElexus } from "@/utils/format-sum-elexus";
import CartOrderModal from "./cart-order-modal";

/*
 * Elexus — savat pastki bloki: to'lov/almashtirish eslatmalari + Итого +
 * "Оформить заказ" tugmasi. Figma 100:935-1007.
 * "Оформить заказ" bosilganda `CartOrderModal` ("// Заявка", Figma
 * 100:1021) ochiladi. `isModalOpen` komponent hali `items.length===0`da
 * HAM mount holida qolishi uchun pastdagi early-return shartiga
 * qo'shildi — aks holda submit vaqtida savat tozalanishi bilan bu
 * komponent `null` qaytarib, ICHIDAGI modalni (tasdiqlash holati bilan
 * birga) darhol unmount qilib yuborardi.
 */
export default function CartSummaryBar() {
  // `mounted`gacha HAR DOIM bo'sh (SSR bilan bir xil, demak `null` qaytadi)
  // — qarang use-mounted.ts izohi (hydration mismatch oldini olish).
  const mounted = useMounted();
  const storeItems = useAppSelector((state) => state.cartElexus.items);
  const items = mounted ? storeItems : [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (items.length === 0 && !isModalOpen) return null;

  const total = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

  return (
    <div
      className="mt-[44px]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
    >
      <div className="flex flex-col gap-10 text-[14px] leading-[1.5] text-black lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-[52px]">
          <p className="max-w-[322px]">
            Оплата при получении, картой или рассрочка
            <br />
            на 12 месяцев без переплаты
          </p>
          <p className="max-w-[322px]">
            Обмен 14 дней, Ковёр забираем сами
            <br />
            Гарантия 25 лет
          </p>
        </div>

        <p className="text-[32px] font-medium leading-[1.5] tracking-[-0.352px] text-black">
          Итого {formatSumElexus(total)} сум
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mt-[38px] flex h-[90px] w-full items-center justify-between bg-[#74301c] px-[33px] text-white opacity-90 transition-opacity duration-150 hover:opacity-100"
      >
        <span className="text-[16px] font-semibold uppercase">Оформить заказ</span>
        <span className="text-[16px] font-semibold">{formatSumElexus(total)} сум</span>
      </button>

      {isModalOpen && <CartOrderModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
