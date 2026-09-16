"use client";

import { useState } from "react";

/**
 * Elexus Catalog Layout (Figma 276:17).
 *
 * Uch qismli tuzilma:
 *   1. Chap sidebar (360w): Sortirovka / Filtr / Kolleksiyalar
 *   2. Markaz: Mahsulot kartalari — har birida chap rasm + o'ng detallar
 *   3. O'ng panel (599w): promo/banner
 *
 * Har mahsulot karta (Figma Frame 46/48):
 *   - Chapda: 315x490 image (Rectangle 47)
 *   - O'ng qatorda:
 *     • "hera luxury M834" title (36px)
 *     • "8 492 00 uzs" price (23px)
 *     • Доступные размеры: 150х230, 300x400
 *     • Доступные цвета: beige, Mavi
 *     • Описание matn
 *     • "Добавить в корзину" button
 *
 * Hozircha statik demo data. Backend integratsiyasi (products, kolleksiyalar,
 * filtrlar) keyingi bosqichda.
 */

const COLLECTIONS = [
  { title: "HERA LUXURY", active: true },
  { title: "Deluxe" },
  { title: "Aspendos" },
  { title: "vercal" },
  { title: "luxury" },
  { title: "tahoe" },
  { title: "Dariush" },
  { title: "dark" },
  { title: "elit" },
];

const FILTER_CHIPS = ["Размер", "Цвет", "Состав"];

const PRODUCTS = [
  {
    title: "hera luxury",
    code: "M834",
    price: "8 492 000 UZS",
    sizes: ["150х230", "300x400"],
    colors: ["beige", "Mavi"],
    description:
      "Мы ценим доверие каждого клиента и стремимся к тому, чтобы каждая покупка приносила комфорт, тепло и уют в ваш дом.",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "hera luxury",
    code: "M834",
    price: "8 492 000 UZS",
    sizes: ["150х230", "300x400"],
    colors: ["beige", "Mavi"],
    description:
      "Мы ценим доверие каждого клиента и стремимся к тому, чтобы каждая покупка приносила комфорт, тепло и уют в ваш дом.",
    img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "hera luxury",
    code: "M834",
    price: "8 492 000 UZS",
    sizes: ["300x400"],
    colors: ["beige"],
    description:
      "Мы ценим доверие каждого клиента и стремимся к тому, чтобы каждая покупка приносила комфорт, тепло и уют в ваш дом.",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=70",
    inCart: true,
    qty: 1,
  },
];

export default function CatalogLayout() {
  const [openCollection, setOpenCollection] = useState<string | null>(
    "HERA LUXURY",
  );

  return (
    <div className="mx-auto max-w-[1920px]">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)_599px]">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="border-r border-black/10 bg-[#FAFAFA] px-[60px] py-[40px]">
          {/* Сортировка */}
          <section className="mb-[40px]">
            <h3 className="mb-[8px] text-[15px] font-semibold text-black">
              Сортировка
            </h3>
            <button className="text-[15px] text-black/70 hover:text-black">
              По ценам
            </button>
          </section>

          {/* Фильтр */}
          <section className="mb-[40px]">
            <h3 className="mb-[10px] text-[15px] font-semibold text-black">
              Фильтр
            </h3>
            <div className="flex flex-wrap gap-[12px]">
              {FILTER_CHIPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="inline-flex items-center gap-[4px] text-[14px] text-black/70 hover:text-black"
                >
                  {c}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </section>

          {/* Коллекции */}
          <section>
            <h3 className="mb-[16px] text-[15px] font-semibold text-black">
              Коллекции
            </h3>
            <ul className="flex flex-col gap-[10px]">
              {COLLECTIONS.map((c) => {
                const isOpen = openCollection === c.title;
                return (
                  <li key={c.title}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCollection(isOpen ? null : c.title)
                      }
                      className={`inline-flex items-center gap-[6px] text-[16px] transition-colors ${
                        isOpen
                          ? "font-bold text-black"
                          : "font-medium text-black/70 hover:text-black"
                      }`}
                    >
                      <span
                        className={`inline-block transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      >
                        ›
                      </span>
                      {c.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>

        {/* ── MAIN: Product cards ── */}
        <main className="px-[20px] py-[40px] lg:px-[32px]">
          <div className="flex flex-col gap-[24px]">
            {PRODUCTS.map((p, i) => (
              <article
                key={i}
                className="grid grid-cols-1 gap-[24px] rounded-[16px] border border-black/5 bg-white p-[20px] sm:grid-cols-[315px_minmax(0,1fr)]"
              >
                {/* Chapda: rasm 315×490 aspect */}
                <div
                  className="overflow-hidden rounded-[12px] bg-[#F4F4F4]"
                  style={{ aspectRatio: "315 / 490" }}
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* O'ngda: title, narx, detallar */}
                <div className="flex flex-col gap-[16px]">
                  {/* Title + code */}
                  <div className="flex flex-wrap items-baseline gap-[16px]">
                    <h2 className="text-[24px] font-bold uppercase text-black sm:text-[28px]">
                      {p.title}
                    </h2>
                    <span className="text-[24px] font-medium text-black/60 sm:text-[28px]">
                      {p.code}
                    </span>
                  </div>

                  {/* Narx */}
                  <span className="text-[22px] font-bold text-black">
                    {p.price}
                  </span>

                  {/* Chip'lar (size, color) — Figma Frame 37 */}
                  <div className="flex flex-wrap items-center gap-[12px]">
                    {p.sizes.slice(0, 1).map((s) => (
                      <span
                        key={s}
                        className="rounded-[6px] border border-black/20 px-[12px] py-[6px] text-[14px] font-medium text-black"
                      >
                        {s}
                      </span>
                    ))}
                    {p.colors.slice(0, 1).map((c) => (
                      <span
                        key={c}
                        className="rounded-[6px] border border-black/20 px-[12px] py-[6px] text-[14px] font-medium text-black"
                      >
                        {c}
                      </span>
                    ))}
                    {/* Quantity counter (agar cart'da bo'lsa) */}
                    {p.inCart && (
                      <div className="ml-auto inline-flex items-center gap-[4px]">
                        <button className="flex h-[33px] w-[33px] items-center justify-center rounded-[6px] border border-black/20 text-[18px] font-semibold text-black hover:bg-black hover:text-white">
                          −
                        </button>
                        <span className="min-w-[24px] text-center text-[15px] font-semibold text-black">
                          {p.qty}
                        </span>
                        <button className="flex h-[33px] w-[33px] items-center justify-center rounded-[6px] border border-black/20 text-[18px] font-semibold text-black hover:bg-black hover:text-white">
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Detallar: Доступные размеры / цвета / Описание */}
                  <div className="mt-[8px] flex flex-col gap-[16px]">
                    {p.sizes.length > 1 && (
                      <DetailBlock title="Доступные размеры" items={p.sizes} />
                    )}
                    {p.colors.length > 1 && (
                      <DetailBlock title="Доступные цвета" items={p.colors} />
                    )}
                    <div>
                      <h4 className="mb-[6px] text-[13px] font-semibold uppercase tracking-wider text-black/50">
                        Описание
                      </h4>
                      <p className="text-[15px] leading-[1.5] text-black/80">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Add to cart button */}
                  {!p.inCart && (
                    <button
                      type="button"
                      className="mt-[8px] inline-flex items-center gap-[10px] self-start text-[15px] font-semibold text-black underline-offset-4 hover:underline"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 6h2l2.5 11h11l2-8H6M9 21a1 1 0 100-2 1 1 0 000 2zM17 21a1 1 0 100-2 1 1 0 000 2z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Добавить в корзину
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* ── RIGHT PANEL: promo banner (Figma Rectangle 93) ── */}
        <aside className="hidden bg-[#F4F4F4] lg:block">
          <div
            className="sticky top-[80px] h-[calc(100vh-80px)] bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%), url('https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=70')",
            }}
          >
            <div className="flex h-full flex-col justify-end p-[40px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
              <span className="text-[13px] font-semibold uppercase tracking-widest opacity-90">
                Новинки
              </span>
              <h3 className="mt-[8px] text-[28px] font-bold leading-tight">
                HERA Deluxe
              </h3>
              <p className="mt-[8px] text-[15px] opacity-90">
                Роскошь и стиль в каждой детали интерьера.
              </p>
              <a
                href="#"
                className="mt-[24px] inline-flex w-fit items-center gap-[8px] rounded-full bg-white/95 px-[24px] py-[12px] text-[14px] font-semibold text-black transition hover:bg-white"
              >
                Смотреть коллекцию
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Detal bloki (Доступные размеры / Доступные цвета) */
function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-[6px] text-[13px] font-semibold uppercase tracking-wider text-black/50">
        {title}
      </h4>
      <div className="flex flex-wrap gap-[8px]">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-[6px] border border-black/15 px-[10px] py-[4px] text-[13px] text-black/70"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
