"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import Container from "./container";
import SectionTitle from "./section-title";

/*
 * Elexus — "Это из наших рук" (portfolio) seksiyasi.
 * Figma frame 100:281 · Frame 74 (media) + Frame 76 (matn).
 * ═════════════════════════════════════════════════════════════════════════
 * O'LCHAMLAR (Figma, tasdiqlangan):
 *
 *   yuqoridan          100px  («О нас» tugagandan sarlavhagacha)
 *   sarlavha           «ЭТО ИЗ НАШИХ РУК» · 16px (SectionTitle)
 *     ↓ 30px
 *   MEDIA              c4 → c11 (8 kolonka) · Figma 1141×644 (240:2601)
 *     ↓ 40px  ← DIQQAT: media TEPASIDAN, pastidan EMAS
 *   nom                16px semibold · #000000 · c1→c2
 *     ↓ 14px
 *   tavsif             14px regular · #7E7C78 · c1→c2
 *     ↓ 24px
 *   arrowlar           32×32 · orasi 16px
 *
 *   media ustidagi yozuv: 14px regular · #ffffff · chapdan va pastdan 16px
 *
 * ALMASHUV (kelishilgan):
 *   Seksiya joyida turadi — scroll bilan kattalashmaydi. Slaydlar O'ZI
 *   almashadi: rasm bo'lsa 5 soniyada, video bo'lsa oxirigacha o'ynab,
 *   tugagach keyingisiga o'tadi.
 *
 *   Taymer faqat seksiya ekranda ko'rinib turganda yuradi
 *   (IntersectionObserver) — aks holda sahifa ochilib turgancha
 *   slaydlar ko'rinmay almashib ketardi.
 *
 *   `prefers-reduced-motion` da avtomatik almashuv o'chadi — faqat ↙ ↗.
 */

/** Rasm slaydi ekranda turadigan vaqt. Video o'z uzunligi bo'yicha. */
const SLIDE_MS = 5000;

export type PortfolioMedia = {
  kind: "image" | "video";
  src: string;
  alt: string;
  /**
   * Zonani qanday to'ldirishi.
   *   "cover"   — zonani to'la qoplaydi, chetlari kesiladi (sukut bo'yicha).
   *   "contain" — media BUTUNLAY ko'rinadi, yonlarda sayt foni qoladi.
   *
   * Zona nisbati 1141/644 ≈ 1.77 (keng). Tik media "cover" bilan qattiq
   * kesiladi — 720×1280 video balandligining atigi ~32% i ko'rinardi.
   */
  fit?: "cover" | "contain";
  /** object-position — zona ichidagi kadr. Faqat "cover" uchun. */
  position?: string;
  /** Faqat video uchun — yuklanguncha ko'rinadigan rasm. */
  poster?: string;
};

export type PortfolioItem = {
  id: string;
  /** «РЕСТОРАН «АФСОНА»» — 16px semibold #000, c1→c2. */
  title: string;
  /** 14px regular #7E7C78. */
  description: string;
  /** Media ustidagi oq yozuv. Berilmasa `title` ishlatiladi. */
  caption?: string;
  media: PortfolioMedia;
};

/*
 * Portfolio obyektlari. Rasmlar joyida, NOM va TAVSIF hali demo —
 * 2–5 obyektlarniki o'ylab topilgan, haqiqiysi bilan almashtiriladi.
 */
const DEMO_ITEMS: readonly PortfolioItem[] = [
  {
    id: "afsona",
    title: "Ресторан «Афсона»",
    description:
      "В чайхану — плоское плетение, которое моется каждую неделю. В зале ковры лежат под столами и держат звук.",
    media: {
      kind: "image",
      src: "/elexus/portfolio-afsona.png",
      alt: "Ресторан «Афсона» — zal",
      fit: "cover", // 2282×1288 (1.77) — zona nisbatiga mos
    },
  },
  {
    id: "portfolio-1",
    title: "Дом на Мирзо Улугбека",
    description:
      "Гостиная 6×4 — один ковёр во всю зону дивана. Подобрали плотность так, чтобы ворс не мялся под ножками.",
    media: {
      kind: "image",
      src: "/elexus/portfolio1.jpg",
      alt: "Portfolio 1",
      fit: "cover", // 1199×799 (1.50)
    },
  },
  {
    id: "portfolio-2",
    title: "Офис «Алока»",
    description:
      "Переговорная и ресепшн. Взяли шерсть корк — держит след от кресел и не бликует под лампами.",
    media: {
      kind: "image",
      src: "/elexus/portfolio2.jpeg",
      alt: "Portfolio 2",
      fit: "contain", // 736×589 (1.25)
    },
  },
  {
    id: "portfolio-3",
    title: "Чайхана на Чорсу",
    description:
      "Пять залов, ковры меняем по сезону. Летние — на хранении у нас, зимние возвращаем к октябрю.",
    media: {
      kind: "image",
      src: "/elexus/portfolio3.jpg",
      alt: "Portfolio 3",
      fit: "contain", // 1123×1400 (0.80) tik
    },
  },
  {
    id: "portfolio-4",
    title: "Квартира на Юнусабаде",
    description:
      "Сняли видео после укладки — ворс лёг ровно, шов между комнатами не читается.",
    media: {
      kind: "video",
      src: "/elexus/portfolio4.mp4",
      alt: "Portfolio 4 — video",
      fit: "contain", // 720×1280 (0.56) tik video
    },
  },
];

export default function PortfolioSection({
  items = DEMO_ITEMS,
}: {
  items?: readonly PortfolioItem[];
}) {
  const count = items.length;
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  /** Seksiya ekranda ko'rinyaptimi — taymer faqat shunda yuradi. */
  const [visible, setVisible] = useState(false);

  const active = items[index];
  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  /* ─── Ko'rinish kuzatuvi ─── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ─── Aktiv video: boshidan o'ynaydi, qolganlari to'xtaydi ───
     Video slayd taymer bilan emas, `onEnded` bilan almashadi — shuning
     uchun bu yerda faqat o'ynatish/to'xtatish bor. */
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index && visible) {
        v.currentTime = 0;
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [index, visible]);

  /* ─── Avtomatik almashuv ───
     Faqat RASM slaydlari uchun. Video o'z `onEnded` i bilan o'tadi,
     aks holda uzun video yarmida kesilib qolardi. */
  useEffect(() => {
    if (!visible || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (active.media.kind === "video") return;
    const t = window.setTimeout(() => go(1), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index, visible, count, active.media.kind, go]);

  return (
    <section
      ref={sectionRef}
      /*
       * OVERLAP SCROLL: bu seksiya oldingi («О нас») ustiga SURILIB keladi.
       *   -mt  → seksiya «О нас» tugashidan bir ekran OLDIN boshlanadi,
       *          ya'ni o'sha oxirgi ekran davomida «О нас» qotib turadi,
       *          bu esa ustidan yurib o'tadi
       *   z-10 → sticky turgan «О нас» ustida chiziladi
       *   bg   → noshaffof bo'lishi SHART, aks holda ostidagi ko'rinib qoladi
       *   min-h→ to'liq ekran balandligi
       */
      className="relative z-10 flex min-h-[calc(100svh-60px)] w-full flex-col justify-center bg-[#F4EFE9] py-20 lg:-mt-[calc(100svh-60px)]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
    >
      <style>{`
        /* Arrowlar — hero'dagi bilan AYNAN bir xil SVG, lekin bu yerda fon
           krem, shuning uchun rang to'q. mask orqali bo'yalgani uchun bitta
           fayl ikkala joyda ishlatiladi. */
        .elx-pf-arrow {
          -webkit-mask: var(--elx-arrow-src) no-repeat center / contain;
          mask: var(--elx-arrow-src) no-repeat center / contain;
          background-color: #000000;
          transform: scale(1);
          transition: background-color 300ms ease-out, transform 300ms ease-out;
        }
        .elx-pf-arrow-btn:hover .elx-pf-arrow,
        .elx-pf-arrow-btn:focus-visible .elx-pf-arrow {
          background-color: var(--elx-bg, #74301c);
          transform: scale(0.9);
        }
        @keyframes elx-pf-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        .elx-pf-text { animation: elx-pf-fade 600ms cubic-bezier(0.33, 0, 0.2, 1); }
        @media (prefers-reduced-motion: reduce) {
          .elx-pf-text { animation: none; }
        }
      `}</style>

      <Container>
        <SectionTitle nodeId="Frame 76">Это из наших рук</SectionTitle>

        {/* Sarlavhadan 30px past — bu yerdan media BOSHLANADI. */}
        <div className="mt-[30px] flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-x-[14px] lg:gap-y-0">
          {/* ─── MATN USTUNI — c1 → c2 ───
                lg+ da media bilan bir qatorda, lekin media tepasidan 40px
                pastda boshlanadi. DOM'da BIRINCHI — shuning uchun kichik
                ekranda o'zi media ustida qoladi. */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:pt-[40px]">
            <div key={active.id} className="elx-pf-text">
              <h3 className="text-[16px] font-semibold uppercase leading-[1.5] text-[#000000]">
                {active.title}
              </h3>
              <p className="mt-[14px] text-[14px] font-normal leading-[1.5] text-[#7E7C78]">
                {active.description}
              </p>
            </div>

            <div className="mt-[24px] flex items-center gap-[16px]">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Oldingi ish"
                className="elx-pf-arrow-btn size-8 shrink-0"
              >
                <span
                  className="elx-pf-arrow block size-8"
                  style={
                    {
                      "--elx-arrow-src": "url(/elexus/arrow-prev.svg)",
                    } as CSSProperties
                  }
                />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Keyingi ish"
                className="elx-pf-arrow-btn size-8 shrink-0"
              >
                <span
                  className="elx-pf-arrow block size-8"
                  style={
                    {
                      "--elx-arrow-src": "url(/elexus/arrow-next.svg)",
                    } as CSSProperties
                  }
                />
              </button>
            </div>
          </div>

          {/* ─── MEDIA — c4 → c11 ───
                Slaydlar stack qilingan va opacity bilan almashadi — shu
                bilan birga rasmlar oldindan yuklanib turadi. */}
          <div
            className="relative aspect-[3/4] w-full overflow-hidden min-[600px]:aspect-[1141/644] lg:col-span-8 lg:col-start-4 lg:row-start-1"
            data-node-id="Frame 74"
          >
            {items.map((item, i) => {
              const contain = item.media.fit === "contain";
              return (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.33,0,0.2,1)] ${
                    i === index ? "opacity-100" : "opacity-0"
                  } ${contain ? "bg-[color:var(--elx-bg,#74301c)]" : ""}`}
                  aria-hidden={i === index ? undefined : true}
                >
                  {item.media.kind === "video" ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={item.media.src}
                      poster={item.media.poster}
                      muted
                      playsInline
                      preload="metadata"
                      onEnded={() => {
                        if (i === index) go(1);
                      }}
                      className={`absolute inset-0 size-full ${
                        contain ? "object-contain" : "object-cover"
                      }`}
                      style={{
                        objectPosition: contain ? undefined : item.media.position,
                      }}
                    />
                  ) : (
                    <Image
                      src={item.media.src}
                      alt={item.media.alt}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className={contain ? "object-contain" : "object-cover"}
                      style={{
                        objectPosition: contain ? undefined : item.media.position,
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* Media ustidagi yozuv — chapdan va pastdan 16px. */}
            <span className="absolute bottom-[16px] left-[16px] text-[14px] font-normal uppercase leading-[1.5] text-white">
              {active.caption ?? active.title}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
