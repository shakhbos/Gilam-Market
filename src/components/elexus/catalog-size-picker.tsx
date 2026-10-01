"use client";

/*
 * Elexus — "Размеры" tanlagichi. `CatalogQuantityPicker` bilan bir xil
 * vizual naqsh (label + "• " bilan ajratilgan bosiladigan qiymatlar,
 * tanlangani qora/qalin, qolganlari kulrang) — oldin shu joyda faqat
 * O'QISH UCHUN matn edi (`collection.specs`dan "200×300 · 250×350 · 300×400"
 * bitta satr), 2026-10-01 user so'rovi bilan interaktiv qilindi.
 * `sizes` — backend'dan keladi (`CatalogCollection.sizes`).
 * Boshqariladigan (`value`/`onChange`) — tanlangan o'lcham ota komponentga
 * (CatalogProductDetail) kerak, chunki "Добавить в корзину" shu tanlov
 * bilan savatga qo'shadi.
 */
export default function CatalogSizePicker({
  sizes,
  value,
  onChange,
}: {
  sizes: readonly string[];
  value: string;
  onChange: (size: string) => void;
}) {
  return (
    <div>
      <p className="text-[14px] uppercase leading-[1.5] text-[#C9C5BF]">Размеры</p>
      <div className="mt-[4px] flex flex-wrap items-center gap-[10px] text-[14px]">
        {sizes.map((s, i) => (
          <span key={s} className="flex items-center gap-[10px]">
            {i > 0 && (
              <span aria-hidden="true" className="text-[#C9C5BF]">
                •
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(s)}
              aria-pressed={value === s}
              className={
                value === s
                  ? "font-semibold text-black"
                  : "text-[#7E7C78] transition-colors duration-150 hover:text-black"
              }
            >
              {s}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
