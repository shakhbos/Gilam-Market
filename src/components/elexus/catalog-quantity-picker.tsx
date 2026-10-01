"use client";

/*
 * Elexus — "Количество" tanlagichi. Figma 100:859-862: label + "• 1 шт
 * • 2 шт • 3 шт", tanlangani qora/qalin, qolganlari kulrang.
 * `max` — backend'dan keladi (`CatalogCollection.maxQuantity`), 1..max
 * oralig'i AVTOMATIK shu asosda tuziladi.
 * Boshqariladigan (`value`/`onChange`) — tanlangan miqdor ota komponentga
 * (CatalogProductDetail) kerak, "Добавить в корзину" shu miqdorda savatga
 * qo'shadi (2026-10-01, savat integratsiyasi bilan birga o'zgartirildi).
 */
export default function CatalogQuantityPicker({
  max,
  value,
  onChange,
}: {
  max: number;
  value: number;
  onChange: (quantity: number) => void;
}) {
  const options = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div>
      <p className="text-[14px] uppercase leading-[1.5] text-[#C9C5BF]">
        Количество
      </p>
      <div className="mt-[4px] flex items-center gap-[10px] text-[14px]">
        {options.map((n, i) => (
          <span key={n} className="flex items-center gap-[10px]">
            {i > 0 && <span aria-hidden="true" className="text-[#C9C5BF]">•</span>}
            <button
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={value === n}
              className={
                value === n
                  ? "font-semibold text-black"
                  : "text-[#7E7C78] transition-colors duration-150 hover:text-black"
              }
            >
              {n} шт
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
