"use client";

import Image from "next/image";
import { useCallback, useState, type CSSProperties } from "react";

import Container from "./container";
import SectionTitle from "./section-title";

/*
 * Elexus — "Отзывы" seksiyasi.
 * Figma frame 100:281 · Group 70 (100:358) + Rectangle 58 (100:357).
 * ═════════════════════════════════════════════════════════════════════════
 * FIGMA O'LCHAMLARI (1920 freym · kontent 1720 · chekka 100):
 *
 *   100:354  sarlavha «Отзывы · 412 оценок»  x=102  y=4883  172×24
 *   100:357  rasm                            x=534  y=4921  418×611  → c4–c6
 *   100:358  sitata bloki                    x=1012 y=4941  663×346
 *     100:359  sharh matni                            663×288
 *     243:2615 uchta ustun (Ковёр/Сервис/оценка)      349×38
 *   100:341  mijoz bloki                     x=100  y=4941  159×63
 *   100:336  arrowlar                        x=100  y=5031   80×32
 *
 *   Vertikal: sarlavha → 14px → rasm
 *             sarlavha → 34px → sitata va mijoz bloki
 *             mijoz bloki → 27px → arrowlar
 *
 * SITATA BLOKI — GRID'GA TEKISLANGAN (kelishilgan):
 *   Figma'da u x=1012, en=663 — 12-ustunli grid'ning hech qaysi ustuniga
 *   tushmaydi (c7 967 da, c8 1111 da boshlanadi). Kelishuv bo'yicha c7–c11
 *   (708.5px) ga qo'yildi va ichiga chapdan 40px padding berildi.
 *   Natijada matn eni 668.5px — Figma'dagi 663 bilan deyarli bir xil,
 *   lekin blok chetlari grid bilan bir chiziqda turadi.
 */

/** Sharh matni — 40px regular (tasdiqlangan). Figma blok 288px ≈ 6 × 48. */
const QUOTE_SIZE = "40px";

export type Review = {
  id: string;
  /** Sharh matni — tirnoqlar bilan. */
  quote: string;
  /** Mijoz: ism, shahar. */
  client: { name: string; city: string };
  /** Gilam nomi — «Ковёр» ustuni. */
  carpet: string;
  /** Xizmat turi — «Сервис» ustuni. */
  service: string;
  /** Baho, 1–5. */
  rating: number;
  /** Mijoz surati, 418×611 nisbatda. */
  photo: string;
};

/*
 * DEMO — matn Figma'dan (100:359, 100:343, 100:361, 100:364).
 * Rasm joyida (836×1222 = 418×611 ning 2x i, nisbat aynan mos).
 * Qolgan sharhlar kerak — hozir bitta.
 */
const DEMO_REVIEWS: readonly Review[] = [
  {
    id: "dilnoza",
    quote:
      "«Привезли четыре ковра домой в субботу и оставили до понедельника. Выбрали при своём свете — и не промахнулись с тоном. Дома он оказался теплее, чем в зале.»",
    client: { name: "Дилноза Абдуллаева", city: "Тошкент" },
    carpet: "Тебриз 60 радж",
    service: "Поставка ковров",
    rating: 5,
    photo: "/elexus/review-photo.png",
  },
];

function Stars({ value }: { value: number }) {
  // Figma: 5 ta yulduz, har biri 14×14, oralarida masofa yo'q (243:2613).
  return (
    <div className="flex" aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          aria-hidden="true"
          className={i < value ? "text-[#222]" : "text-[#C9C5BF]"}
        >
          <path
            d="M7 1.2l1.7 3.6 3.9.5-2.9 2.7.8 3.9L7 10.1l-3.5 1.8.8-3.9L1.4 5.3l3.9-.5L7 1.2Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}

/** Yorliq + qiymat — «О нас» statistikasi bilan bir xil uslubda. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[3px]">
      <span className="text-[14px] uppercase leading-[normal] text-[#7E7C78]">
        {label}
      </span>
      <span className="text-[14px] leading-[normal] text-[#222]">{children}</span>
    </div>
  );
}

export default function ReviewsSection({
  reviews = DEMO_REVIEWS,
  /** Sarlavhadagi umumiy baholar soni. */
  total = 412,
}: {
  reviews?: readonly Review[];
  total?: number;
}) {
  const count = reviews.length;
  const [index, setIndex] = useState(0);
  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );
  const r = reviews[index];

  return (
    <section
      className="w-full bg-[#F4EFE9] pb-20 pt-[100px]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
      data-node-id="100:358"
    >
      <style>{`
        .elx-rv-arrow {
          -webkit-mask: var(--elx-arrow-src) no-repeat center / contain;
          mask: var(--elx-arrow-src) no-repeat center / contain;
          background-color: #000000;
          transform: scale(1);
          transition: background-color 300ms ease-out, transform 300ms ease-out;
        }
        .elx-rv-arrow-btn:hover .elx-rv-arrow,
        .elx-rv-arrow-btn:focus-visible .elx-rv-arrow {
          background-color: var(--elx-bg, #74301c);
          transform: scale(0.9);
        }
        @keyframes elx-rv-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        .elx-rv-anim { animation: elx-rv-fade 600ms cubic-bezier(0.33, 0, 0.2, 1); }
        @media (prefers-reduced-motion: reduce) { .elx-rv-anim { animation: none; } }
      `}</style>

      <Container>
        <SectionTitle nodeId="100:354">
          {`Отзывы · ${total} оценок`}
        </SectionTitle>

        {/* Sarlavhadan 14px past — rasm shu yerdan boshlanadi. Matn
              ustunlari esa 34px past, ya'ni yana 20px pastroqda. */}
        <div className="mt-[14px] flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-x-[14px] lg:gap-y-0">
          {/* ─── CHAP USTUN — c1 ─── mijoz ma'lumoti va arrowlar */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:pt-[20px]">
            <div key={r.id} className="elx-rv-anim">
              <Fact label="Клиент">
                <span className="block text-[16px] font-semibold text-[#000]">
                  {r.client.name}
                </span>
                <span className="block text-[14px] text-[#222]">{r.client.city}</span>
              </Fact>
            </div>

            <div className="mt-[27px] flex items-center gap-[16px]">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Oldingi sharh"
                className="elx-rv-arrow-btn size-8 shrink-0"
              >
                <span
                  className="elx-rv-arrow block size-8"
                  style={
                    { "--elx-arrow-src": "url(/elexus/arrow-prev.svg)" } as CSSProperties
                  }
                />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Keyingi sharh"
                className="elx-rv-arrow-btn size-8 shrink-0"
              >
                <span
                  className="elx-rv-arrow block size-8"
                  style={
                    { "--elx-arrow-src": "url(/elexus/arrow-next.svg)" } as CSSProperties
                  }
                />
              </button>
            </div>
          </div>

          {/* ─── RASM — c4 → c6 ─── Figma 418×611 */}
          <div
            className="relative aspect-[418/611] w-full overflow-hidden lg:col-span-3 lg:col-start-4 lg:row-start-1"
            data-node-id="100:357"
          >
            <Image
              key={r.id}
              src={r.photo}
              alt={r.client.name}
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* ─── SITATA BLOKI — c7 → c11, chapdan 40px ─── */}
          <div
            className="lg:col-span-5 lg:col-start-7 lg:row-start-1 lg:pl-[40px] lg:pt-[20px]"
            data-node-id="243:2616"
          >
            <div key={r.id} className="elx-rv-anim flex h-full flex-col justify-between gap-10">
              <blockquote
                className="font-normal leading-[1.2] text-[#222]"
                style={{ fontSize: QUOTE_SIZE }}
                data-node-id="100:359"
              >
                {r.quote}
              </blockquote>

              {/* Uchta ustun — Figma 243:2615, x=0/136/278 */}
              <div className="flex gap-[35px]" data-node-id="243:2615">
                <Fact label="Ковёр">{r.carpet}</Fact>
                <Fact label="Сервис">{r.service}</Fact>
                <Fact label="Оценка">
                  <Stars value={r.rating} />
                </Fact>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
