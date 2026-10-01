"use client";

import { Link } from "@/i18n/routing";
import { useAppSelector } from "@/lib/hooks";
import { useMounted } from "@/hooks/use-mounted";
import CartItemRow from "./cart-item-row";

/*
 * Elexus — savat qatorlari ro'yxati. Figma'da bo'sh savat holati yo'q
 * (mockup har doim 2 ta band bilan ko'rsatilgan) — bu yerda haqiqiy
 * savat uchun zarur minimal holat qo'shildi.
 */
export default function CartListing() {
  // `mounted`gacha HAR DOIM bo'sh ro'yxat (SSR bilan bir xil) — qarang
  // use-mounted.ts izohi (hydration mismatch oldini olish).
  const mounted = useMounted();
  const storeItems = useAppSelector((state) => state.cartElexus.items);
  const items = mounted ? storeItems : [];

  if (items.length === 0) {
    return (
      <div className="mt-[40px] flex flex-col items-start gap-4 border-y border-[#dcd8d2] py-[60px]">
        <p className="text-[16px] text-[#7E7C78]">Корзина пуста.</p>
        <Link
          href="/catalog"
          className="text-[14px] font-semibold uppercase text-black underline underline-offset-4 transition-opacity duration-150 hover:opacity-60"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-[40px]">
      {items.map((item, i) => (
        <CartItemRow key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}
