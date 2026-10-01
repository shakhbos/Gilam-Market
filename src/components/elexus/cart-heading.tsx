"use client";

import { useAppSelector } from "@/lib/hooks";
import { useMounted } from "@/hooks/use-mounted";
import { formatAreaSqm, formatCartDate, parseSizeAreaSqm, pluralizeCarpets } from "@/utils/elexus-cart";

/*
 * Elexus — savat sahifa sarlavhasi. Figma frame 100:931, node 932-938.
 * Uch ustunli statistika qatori 12-kolonka grid tizimiga moslashtirildi —
 * Figma'dagi aniq x (102/390/567) grid chizig'iga 100% qat'iy tushmaydi
 * (farq eng ko'pi 33px), lekin loyihaning umumiy ustun tizimi bilan mos.
 */
export default function CartHeading() {
  // `mounted`gacha HAR DOIM bo'sh savat sifatida render qilinadi (SSR bilan
  // bir xil) — qarang use-mounted.ts izohi (hydration mismatch oldini olish).
  const mounted = useMounted();
  const storeItems = useAppSelector((state) => state.cartElexus.items);
  const items = mounted ? storeItems : [];

  const totalCarpets = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalArea = items.reduce(
    (sum, item) => sum + parseSizeAreaSqm(item.size) * item.quantity,
    0,
  );
  const firstAdded = items.reduce<string | null>(
    (earliest, item) => (!earliest || item.addedAt < earliest ? item.addedAt : earliest),
    null,
  );

  return (
    <div style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}>
      <h1 className="text-[50px] font-medium uppercase leading-[1.5] tracking-[-0.55px] text-black">
        {"//  Корзина"}
      </h1>

      <div className="mt-[12px] grid grid-cols-12 gap-x-[14px] gap-y-6 text-black">
        <div className="col-span-12 text-[26px] font-medium uppercase leading-[1.5] tracking-[-0.286px] sm:col-span-6 lg:col-span-2">
          {items.length > 0 ? (
            <p>
              {totalCarpets} {pluralizeCarpets(totalCarpets)} {totalCarpets === 1 ? "отобран" : "отобраны"}
            </p>
          ) : (
            <p>Выберите ковры</p>
          )}
          <p>для доставки</p>
          <p>в ташкент.</p>
        </div>

        {items.length > 0 && (
          <>
            <div className="col-span-6 whitespace-nowrap text-[14px] leading-[1.5] sm:col-span-3 lg:col-span-1 lg:col-start-3">
              <p>Позиций: {String(items.length).padStart(2, "0")};</p>
              <p>Ковров: {totalCarpets}</p>
              <p>Площадь: {formatAreaSqm(totalArea)} м²</p>
            </div>

            <div className="col-span-6 whitespace-nowrap text-[14px] leading-[1.5] sm:col-span-3 lg:col-span-2 lg:col-start-4">
              <p>Доставка: бесплатно</p>
              {firstAdded && <p>Собрано {formatCartDate(firstAdded)}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
