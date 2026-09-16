"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Elexus Catalog Layout (Figma 276:17).
 *
 * Tuzilma:
 *   1. Chap sticky sidebar (360w): Sortirovka / Filtr / Kolleksiyalar
 *   2. Markaz (scrollable): mahsulot kartalari — chap rasm + o'ng detallar
 *   3. O'ng sticky "video zone" (599w): aktiv product'ning videosi
 *      IntersectionObserver bilan asosiy zonadagi kartaga qarab avto almashadi.
 *
 * Border-radius YO'Q — barcha kartalar va konteynerlar keskin burchakli.
 * Ikkala sidebar sticky top-80px, header'dan pastda to'liq viewport
 * balandligini egallaydi va o'z ichida scroll qilmaydi (overflow-hidden).
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

type Product = {
  title: string;
  code: string;
  price: string;
  sizes: string[];
  colors: string[];
  description: string;
  img: string;
  /** Product videosi — kelajakda backend'dan keladi, hozircha bo'sh bo'lsa rasm ko'rsatiladi. */
  video?: string;
  inCart?: boolean;
  qty?: number;
};

const PRODUCTS: Product[] = [
  {
    title: "hera luxury",
    code: "M834",
    price: "8 492 000 UZS",
    sizes: ["150х230", "300x400"],
    colors: ["beige", "Mavi"],
    description:
      "Мы ценим доверие каждого клиента и стремимся к тому, чтобы каждая покупка приносила комфорт, тепло и уют в ваш дом.",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=70",
  },
  {
    title: "hera luxury",
    code: "M834",
    price: "8 492 000 UZS",
    sizes: ["150х230", "300x400"],
    colors: ["beige", "Mavi"],
    description:
      "Мы ценим доверие каждого клиента и стремимся к тому, чтобы каждая покупка приносила комфорт, тепло и уют в ваш дом.",
    img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=70",
  },
  {
    title: "hera luxury",
    code: "M834",
    price: "8 492 000 UZS",
    sizes: ["300x400"],
    colors: ["beige"],
    description:
      "Мы ценим доверие каждого клиента и стремимся к тому, чтобы каждая покупка приносила комфорт, тепло и уют в ваш дом.",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=70",
    inCart: true,
    qty: 1,
  },
];

export default function CatalogLayout() {
  const [openCollection, setOpenCollection] = useState<string | null>(
    "HERA LUXURY",
  );

  // O'ng sidebar aktiv product — IntersectionObserver bilan yangilanadi
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            // Card viewport markazidan o'tsa aktiv bo'ladi
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveIndex(i);
            }
          }
        },
        {
          root: null,
          // Header pastida va CTA yuqorisidagi zona — card markaziga fokus
          rootMargin: "-30% 0px -30% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const active = PRODUCTS[activeIndex];

  return (
    <div className="mx-auto max-w-[1920px]">
      <div className="grid grid-cols-1 items-start lg:grid-cols-[360px_minmax(0,1fr)_599px]">
        {/* ── LEFT STICKY SIDEBAR (fixed, no internal scroll) ── */}
        <aside className="sticky top-[80px] hidden h-[calc(100vh-80px)] overflow-hidden border-r border-black/10 bg-[#FAFAFA] px-[60px] py-[40px] lg:block">
          <section className="mb-[40px]">
            <h3 className="mb-[8px] text-[15px] font-semibold text-black">
              Сортировка
            </h3>
            <button className="text-[15px] text-black/70 hover:text-black">
              По ценам
            </button>
          </section>

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

        {/* ── MAIN: scrollable product list ── */}
        <main className="px-[20px] py-[40px] lg:px-[32px]">
          <div className="flex flex-col gap-[24px]">
            {PRODUCTS.map((p, i) => (
              <article
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                data-active={i === activeIndex}
                className="grid grid-cols-1 gap-[24px] border border-black/10 bg-white p-[20px] transition-colors data-[active=true]:border-black/40 sm:grid-cols-[315px_minmax(0,1fr)]"
              >
                {/* Rasm — border-radius YO'Q */}
                <div
                  className="overflow-hidden bg-[#F4F4F4]"
                  style={{ aspectRatio: "315 / 490" }}
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Detallar */}
                <div className="flex flex-col gap-[16px]">
                  <div className="flex flex-wrap items-baseline gap-[16px]">
                    <h2 className="text-[24px] font-bold uppercase text-black sm:text-[28px]">
                      {p.title}
                    </h2>
                    <span className="text-[24px] font-medium text-black/60 sm:text-[28px]">
                      {p.code}
                    </span>
                  </div>

                  <span className="text-[22px] font-bold text-black">
                    {p.price}
                  </span>

                  <div className="flex flex-wrap items-center gap-[12px]">
                    {p.sizes.slice(0, 1).map((s) => (
                      <span
                        key={s}
                        className="border border-black/20 px-[12px] py-[6px] text-[14px] font-medium text-black"
                      >
                        {s}
                      </span>
                    ))}
                    {p.colors.slice(0, 1).map((c) => (
                      <span
                        key={c}
                        className="border border-black/20 px-[12px] py-[6px] text-[14px] font-medium text-black"
                      >
                        {c}
                      </span>
                    ))}
                    {p.inCart && (
                      <div className="ml-auto inline-flex items-center gap-[4px]">
                        <button className="flex h-[33px] w-[33px] items-center justify-center border border-black/20 text-[18px] font-semibold text-black hover:bg-black hover:text-white">
                          −
                        </button>
                        <span className="min-w-[24px] text-center text-[15px] font-semibold text-black">
                          {p.qty}
                        </span>
                        <button className="flex h-[33px] w-[33px] items-center justify-center border border-black/20 text-[18px] font-semibold text-black hover:bg-black hover:text-white">
                          +
                        </button>
                      </div>
                    )}
                  </div>

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

        {/* ── RIGHT STICKY VIDEO ZONE ── */}
        <aside className="sticky top-[80px] hidden h-[calc(100vh-80px)] overflow-hidden border-l border-black/10 bg-black lg:block">
          {/* Aktiv product'ning video/rasm kontenti */}
          {active.video ? (
            <video
              key={active.video}
              src={active.video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              key={active.img}
              src={active.img}
              alt={active.title}
              className="h-full w-full object-cover"
            />
          )}

          {/* Overlay: aktiv product ma'lumoti */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-[8px] bg-gradient-to-t from-black/70 to-transparent p-[40px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
            <span className="text-[13px] font-semibold uppercase tracking-widest opacity-80">
              {active.code}
            </span>
            <h3 className="text-[28px] font-bold uppercase leading-tight">
              {active.title}
            </h3>
            <span className="text-[18px] font-semibold">{active.price}</span>
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
            className="border border-black/15 px-[10px] py-[4px] text-[13px] text-black/70"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
