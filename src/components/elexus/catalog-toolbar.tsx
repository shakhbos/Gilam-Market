"use client";

import { useState } from "react";

import Container from "./container";

/*
 * Elexus — Catalog sahifa sarlavhasi + filtr/saralash qatori.
 * Figma frame 100:625, node 100:626 (sarlavha) + 100:677..685 (filtr/sort).
 * ─────────────────────────────────────────────────────────────────────────
 * JOYLASHUV (kelishilgan aniq qiymatlar — Figma'dan emas, mahsulot
 * ko'rsatmasidan):
 *   Header (60px, sticky top-0) dan 40px past — "Каталог" qatori.
 *   Qator balandligi 50px, matn 50px (leading-none — matn qatorni to'liq
 *   to'ldiradi), filtrlar shu qator bilan PASTKI chiziqda (items-end).
 *   Qator ostidan 20px keyin — birinchi mahsulot qatori (rasm).
 *
 *   `h-[50px]` faqat xl+ da qat'iy: filtrlar bitta qatorga sig'adi. Undan
 *   tor ekranda balandlik avtomatik (`h-auto`) — qat'iy 50px ularni kesib
 *   qo'yar edi (rasm bilan ustma-ust tushardi).
 *
 * RESPONSIVE — 3 BOSQICH (kenglik torayishi bo'yicha):
 *   1) xl+ (≥1280px)   — hammasi bitta qatorda: sarlavha + filtrlar yonma-yon.
 *   2) md..xl (768-1279)— sarlavha va filtrlar HALI yonma-yon (qator
 *      bo'linmaydi), lekin filtrlarning O'ZI joy yetmagani uchun 2 qatorga
 *      o'raladi — sarlavha bitta baland ustunda, filtrlar blok sifatida
 *      o'ng tomonda, pastki chiziqda (items-end).
 *   3) <md (<768px)     — endi sarlavha va filtrlar ham yonma-yon sig'maydi:
 *      filtrlar bloki SARLAVHA OSTIGA tushadi (ustun bo'lib), o'zi ham
 *      kerak bo'lsa bir necha qatorga o'raladi.
 *
 * STICKY XATTI-HARAKATI:
 *   Bu qator boshida (scroll=0) header'dan 40px pastda — oddiy oqimda.
 *   Pastga scroll qilinganda 40px masofani "yeb", header'ning pastki
 *   chetiga (`top-[60px]`) tegishi bilan o'zi sticky bo'lib qotadi.
 *   40px bo'shliq shuning uchun PADDING emas, `mt-[40px]` — agar u sticky
 *   qutining ICHIDA (padding) bo'lsa, quti header'ga bevosita yopishgan
 *   holda boshlanadi va scroll birinchi pikselidayoq "qotgan" bo'lib
 *   qoladi — oraliq YEYILMAYDI. Margin esa qutining o'zini pastga suradi,
 *   shu 40px chinakam scroll masofasi bo'lib qoladi.
 *
 *   Qotgach: fon shaffof emas (#F4EFE9, sahifa foni bilan bir xil) va
 *   z-index header'dan (z-50) past, lekin mahsulot qatorlaridan (oddiy
 *   oqim, z-index yo'q) baland — shuning uchun pastdagi gilam rasmlari
 *   scroll paytida shu qatorning OSTIGA kirib g'oyib bo'ladi, u esa joyida
 *   qotib qoladi.
 *
 * RANG TIZIMI (bu sahifada piksel bilan tekshirilgan 3 daraja):
 *   #C9C5BF — label/nofaol (n°, spec yorliqlari, nofaol filtr)
 *   #7E7C78 — ikkinchi darajali matn (tavsif, spec qiymati, "Сортировка:")
 *   #000    — asosiy urg'u (sarlavha, faol filtr, tanlangan sort, nom)
 *
 * INTERAKTIVLIK: backend filtri yo'q (hozircha demo — Products/Discounts
 * seksiyalaridagi kabi), lekin faol/nofaol vizual holat ishlaydi (useState).
 */

const FILTERS = [
  "Все",
  "Ручная работа",
  "Современные",
  "Шёлк",
  "Шерсть",
  "Со скидкой",
] as const;

export default function CatalogToolbar() {
  const [active, setActive] = useState<string>(FILTERS[0]);

  return (
    <div
      className="sticky top-[60px] z-10 mt-[40px] w-full bg-[#F4EFE9] pb-[20px]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
    >
      <Container>
        <div className="flex h-auto flex-col items-start gap-y-3 md:flex-row md:items-end md:justify-between md:gap-x-10 xl:h-[50px]">
          <h1
            className="text-[50px] font-semibold leading-none text-black"
            data-node-id="100:626"
          >
            Каталог
          </h1>

          <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-[14px] leading-none xl:flex-nowrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={active === f}
                className={`whitespace-nowrap transition-colors duration-150 ${
                  active === f
                    ? "text-black"
                    : "text-[#C9C5BF] hover:text-[#7E7C78]"
                }`}
              >
                {f}
              </button>
            ))}

            <span className="whitespace-nowrap text-[#C9C5BF]">Ряд</span>

            <span className="whitespace-nowrap text-[#7E7C78]">
              Сортировка:{" "}
              <span className="text-black">по популярности ↓</span>
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}
