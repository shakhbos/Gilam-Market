"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Volume2, VolumeX } from "lucide-react";

/*
 * Elexus Hero Showcase — Title'dan keyingi blok.
 * Figma frame 100:281 · Frame 53 (200:2515) + Frame 52 (200:2514).
 * ─────────────────────────────────────────────────────────────────────────
 * FIGMA O'LCHAMLARI (1920 freym, kontent 1720, chekka margin 100):
 *   Title Frame 50   y=100  h=144   → y=244 da tugaydi
 *   Blok boshlanishi y=258          → title'dan 14px past
 *
 *   CHAP USTUN — Frame 53 (x=100, y=268, w=221, h=196), ichki gap 24px:
 *     Frame 51  description  y=0    h=68  (4 satr × 17px, w=203)
 *     Frame 6   karusel      y=92   h=40  (gap 16px)
 *     Frame 4   arrowlar     y=156  h=40  (gap 16px)
 *   y=268 → blok boshidan (258) yana 10px past → chap ustunda pt-[10px].
 *
 *   O'NG USTUN — Frame 52 (x=537, y=258, w=1282, h=591) media zonasi.
 *   Blok bilan bir xil y=258 da boshlanadi, ya'ni 10px padding YO'Q.
 *
 * GRID (Figma bilan bir xil):
 *   Chap ustun  col-1 → col-2   (2 kolonka)
 *   O'ng ustun  col-4 → col-12  (9 kolonka) — Figma: x=437 ≈ c4 (433.5),
 *               o'ng cheti kontent chetida. 9 kolonka = 1286.5 ≈ 1282.
 *               c3 bo'sh qoladi — dizaynning o'zida shunday.
 *
 * TIPOGRAFIYA:
 *   Description — Inter Tight Regular (400) · 14px · #e0caab · satr 17px.
 *
 * AVATAR ZONASI (Figma'da node yo'q — yangi funksionallik):
 *   Media zonasining chap yuqori burchagida:
 *     10px     media burchagidan chetlanish
 *     230×230  to'rtburchak UI panel
 *     24px     panel ichidagi padding
 *     182×182  dumaloq obzor zonasi (video yoki rasm)
 *   Faqat slayd `author` bilan kelganda ko'rinadi (obzor qiluvchi odam).
 *   Avatar video bo'lsa — hover'da ovoz yoqish/o'chirish tugmasi chiqadi.
 *
 * RESPONSIV:
 *   lg (≥1024px) — Figma'dagi 2 + 10 kolonkali bo'linish.
 *   Undan tor ekranda ustunlar ustma-ust joylashadi (Figma'da mobil freym yo'q).
 */

export type HeroSlide = {
  id: string;
  /** Description satrlari — har biri ALOHIDA text (Figma Frame 51, xuddi Title kabi). */
  specs: readonly string[];
  /** Karusel thumbnail (40×40). */
  thumb: string;
  /** Banner kontenti — rasm yoki video. */
  media:
    | { kind: "image"; src: string; alt: string }
    | { kind: "video"; src: string; poster?: string };
  /**
   * Sharh muallifi. FAQAT shu bo'lganda avatar zonasi ko'rinadi —
   * ya'ni banner obzor qiluvchi odamning videosi bo'lsa.
   */
  author?: {
    name: string;
    /** Avatar videosi — bo'lsa hover'da ovoz tugmasi chiqadi. */
    video?: string;
    /** Avatar rasmi — video bo'lmaganda ishlatiladi. */
    image?: string;
    /**
     * Rasmni doira ichida kesish (Figma'dagi crop transformi).
     * Foizlar doira o'lchamiga nisbatan, shuning uchun 230px va 140px
     * panellarda bir xil kadr chiqadi.
     * Berilmasa — oddiy `object-cover` (markazdan kesish).
     */
    imageCrop?: { width: string; height: string; left: string; top: string };
  };
};

/**
 * Karusel thumbnail o'lchamlari — Figma Frame 6 (100:287) bo'yicha.
 * Bular POZITSIYAGA bog'langan (ma'lumotga emas), chunki dizaynda har slot
 * o'zining o'lchamiga ega:
 *   1  30×40  to'rtburchak  (Figma "Rectangle 60", xom qiymat 29px)
 *   2  40×40  DOIRA         (Figma "image 4")
 *   3  40×40  to'rtburchak  (Figma "Rectangle 61")
 *   4  64×40  to'rtburchak  (Figma "Rectangle 59")
 * 4 tadan ortiq slayd bo'lsa — 40×40 to'rtburchak.
 */
const THUMB_SHAPES = [
  { w: 30, h: 40, round: false },
  { w: 40, h: 40, round: true },
  { w: 40, h: 40, round: false },
  { w: 64, h: 40, round: false },
] as const;

const THUMB_FALLBACK = { w: 40, h: 40, round: false } as const;

export default function HeroShowcase({
  slides,
}: {
  slides: readonly HeroSlide[];
}) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);

  const slide = slides[index];
  const author = slide?.author;

  // React `muted` proprtini DOM'ga har doim ishonchli qo'ymaydi (SSR'da
  // atribut tushib qoladi) — shuning uchun ref orqali ham sinxronlaymiz.
  useEffect(() => {
    if (avatarVideoRef.current) avatarVideoRef.current.muted = muted;
  }, [muted, index]);

  if (!slide) return null;

  const go = (step: number) =>
    setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <>
      <style>{`
        /* Arrow ikonkasi — shakl Figma SVG'sidan (mask), rang CSS'dan.
           Figma faylida opacity .2 SVG ichiga singdirilgan edi; u CSS'ga
           ko'chirildi (path'lar tegilmagan), shuning uchun tinch holat
           Figma bilan aynan bir xil, lekin hover'da oqqa o'ta oladi. */
        .elx-arrow {
          -webkit-mask: var(--elx-arrow-src) no-repeat center / contain;
          mask: var(--elx-arrow-src) no-repeat center / contain;
          background-color: #E0CAAB;
          opacity: 0.2;
          transform: scale(1);
          /* Burger menyu bilan bir xil ritm: 300ms ease-out. */
          transition:
            opacity 300ms ease-out,
            background-color 300ms ease-out,
            transform 300ms ease-out;
        }
        /* Hover: oq, to'liq ko'rinadigan va ozgina kichrayadi. */
        .elx-arrow-btn:hover .elx-arrow,
        .elx-arrow-btn:focus-visible .elx-arrow {
          opacity: 1;
          background-color: #ffffff;
          transform: scale(0.9);
        }
      `}</style>

      {/* Title'dan 14px past. */}
      <div className="mt-[14px] grid grid-cols-12 gap-x-[14px] gap-y-10">
        {/* ─── CHAP USTUN (col-1 → col-2) — Figma Frame 53 ───
            Uch bo'lak bitta ustun div ichida, oralari 24px (Figma gap-[24px]).
            pt-[10px] — Figma'da description blok boshidan 10px pastda. */}
        <div
          className="col-span-12 col-start-1 flex flex-col gap-6 pt-[10px] lg:col-span-2"
          data-node-id="200:2515"
        >
          {/* Description — har satr alohida text (Figma Frame 51). */}
          <div
            className="flex flex-col text-[14px] leading-[17px] text-[#e0caab]"
            style={{
              fontFamily: "var(--font-inter-tight), Inter, sans-serif",
              fontWeight: 400,
            }}
            data-node-id="200:2513"
          >
            {slide.specs.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          {/* Karusel — thumbnail'lar, oralik 16px (Figma Frame 6).
                Figma'ning 4 ta thumbnail'i 30+16+40+16+40+16+64 = 222px joy
                talab qiladi, 2 kolonka esa buni faqat ~1442px'dan keng
                ekranda beradi. Sig'magan thumbnail PASTGA TUSHADI (wrap).
                Gorizontal scroll ishlatilmaydi: u sig'magan thumbnail'ni
                ustun chekkasida qirqib, butunlay ko'rinmas qilib qo'yardi. */}
          <div
            className="flex flex-wrap items-center gap-4"
            role="tablist"
            aria-label="Bannerni tanlash"
            data-node-id="100:287"
          >
            {slides.map((s, i) => {
              const shape = THUMB_SHAPES[i] ?? THUMB_FALLBACK;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1}-banner`}
                  onClick={() => setIndex(i)}
                  style={{ width: shape.w, height: shape.h }}
                  className={`relative shrink-0 overflow-hidden transition-opacity duration-150 hover:opacity-100 ${
                    i === index ? "opacity-100" : "opacity-50"
                  } ${shape.round ? "rounded-full" : ""}`}
                >
                  <Image
                    src={s.thumb}
                    alt=""
                    fill
                    sizes={`${shape.w}px`}
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* Arrowlar — Figma Frame 4, ikonkalar 40×40, oralik 16px.
              Ikonka CSS `mask` sifatida ishlatiladi: SHAKL Figma SVG'sidan,
              RANG esa CSS'dan — shuning uchun hover'da oqqa o'ta oladi.
              Tinch holat Figma bilan aynan bir xil: #E0CAAB, opacity .2. */}
          <div className="flex items-center gap-4" data-node-id="100:292">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Oldingi banner"
              className="elx-arrow-btn size-10 shrink-0"
              data-node-id="100:293"
            >
              <span
                className="elx-arrow block size-10"
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
              aria-label="Keyingi banner"
              className="elx-arrow-btn size-10 shrink-0"
              data-node-id="100:294"
            >
              <span
                className="elx-arrow block size-10"
                style={
                  {
                    "--elx-arrow-src": "url(/elexus/arrow-next.svg)",
                  } as CSSProperties
                }
              />
            </button>
          </div>
        </div>

        {/* ─── O'NG USTUN — Figma Frame 52, media zonasi ───
              Uch bosqichli joylashuv (ekran torayib borgani sari kengayadi):
                ≥ 1360px   col-4 → col-12  (9 kolonka) — Figma: x=437 ≈ c4,
                                            c3 bo'sh qoladi, dizayndagidek
                1024–1359  col-3 → col-12  (10 kolonka) — c3 ham ishga tushadi,
                                            joy torayganda zona kengayadi
                < 1024px   to'liq kenglik, ustunlar ustma-ust (wrap)

              NISBAT:
                ≥ 600px   16:9 (`aspect-video`) — Figma'dagi 1282/591 ≈ 2.17
                          emas: zona video uchun ham ishlatiladi, 16:9 da
                          video letterbox bo'lmaydi va 2.17 juda past edi.
                < 600px   3:2 — tor ekranda 16:9 balandligi juda qisqarardi
                          (390px'da atigi 197px). 3:2 uni 233px ga ko'taradi
                          (+18%), 16:9 videoni esa atigi ~16% enidan kesadi.
                          4:3 balandroq bo'lardi, lekin ~33% kesardi — video
                          uchun juda ko'p.

              BALANDLIK SHIFTI (lg+): `max-h-[calc(100svh-378px)]`
                378 = main pt 20 + header 60 + hero pt 20 + title 144
                      + showcase mt 14 + hero pb 80 + keyingi seksiya 40.
                Shu tufayli hero har doim viewport'ga sig'adi va keyingi
                seksiyadan ~40px ko'rinib turadi.
                `w-full` SHART: usiz `aspect-ratio` + `max-height` birga
                ishlaganda brauzer enini ham kichraytirib yuboradi va media
                o'z kolonkalarini to'ldirmay qoladi (o'ng chetda bo'shliq
                paydo bo'lardi). `w-full` enini qat'iy qiladi — quti past
                ekranda 16:9 dan pastroq bo'ladi va rasm tepa-pastidan
                kesiladi (object-cover), lekin o'ng chet tekis qoladi.
                Baland ekranda shift umuman ishlamaydi, 16:9 saqlanadi. */}
        <div
          className="relative col-span-12 col-start-1 aspect-[3/2] w-full overflow-hidden min-[600px]:aspect-video lg:col-span-10 lg:col-start-3 lg:max-h-[calc(100svh-378px)] min-[1360px]:col-span-9 min-[1360px]:col-start-4"
          data-node-id="200:2514"
        >
          {slide.media.kind === "image" ? (
            <Image
              src={slide.media.src}
              alt={slide.media.alt}
              fill
              priority
              sizes="(min-width: 1024px) 83vw, 100vw"
              className="object-cover"
            />
          ) : (
            <video
              src={slide.media.src}
              poster={slide.media.poster}
              autoPlay
              loop
              muted
              playsInline
              className="size-full object-cover"
            />
          )}

          {/* Avatar zonasi — chap yuqori burchak, 10px padding.
              Faqat slaydda `author` bo'lsa render qilinadi (obzor qiluvchi
              odam videosi). Tuzilma — uch bosqich:
                                    < 450px   450–1023   lg+ (Figma)
                panel (to'rtburchak)  100×100   140×140    230×230
                padding                 10px      14px       24px
                dumaloq obzor zonasi   80×80    112×112    182×182
              Media burchagidan chetlanish har doim 10px.
              450px'dan tor ekranda panel media balandligining 64% ini
              egallab, bannerni bekitib qo'yardi — shuning uchun uchinchi,
              eng kichik bosqich qo'shilgan.
              Fon `--elx-bg` dan — sayt rangi o'zgarsa panel ham o'zgaradi. */}
          {author && (
            <div className="absolute left-0 top-0 p-[10px]">
              <div className="size-[100px] bg-[color:var(--elx-bg,#5E2C1A)] p-[10px] min-[450px]:size-[140px] min-[450px]:p-[14px] lg:size-[230px] lg:p-6">
                <div className="group relative size-full overflow-hidden rounded-full">
                  {author.video ? (
                    <video
                      ref={avatarVideoRef}
                      src={author.video}
                      autoPlay
                      loop
                      muted={muted}
                      playsInline
                      aria-label={`${author.name} — sharh videosi`}
                      className="size-full object-cover"
                    />
                  ) : author.image ? (
                    // `imageCrop` berilgan bo'lsa — Figma'dagi aniq kadr.
                    // Geometriya TASHQI div'da: next/image `fill` bilan
                    // `style.width` ni birga qabul qilmaydi. Foizlar doiraga
                    // nisbatan, shuning uchun 230px va 140px panelda kadr
                    // bir xil chiqadi. Crop yo'q bo'lsa — oddiy object-cover.
                    <div
                      className="absolute"
                      style={
                        author.imageCrop
                          ? {
                              width: author.imageCrop.width,
                              height: author.imageCrop.height,
                              left: author.imageCrop.left,
                              top: author.imageCrop.top,
                            }
                          : { inset: 0 }
                      }
                    >
                      <Image
                        src={author.image}
                        alt={author.name}
                        fill
                        sizes={
                          // Kesilgan rasm doiradan 3.65× katta render bo'ladi.
                          author.imageCrop
                            ? "(min-width: 1024px) 665px, (min-width: 450px) 409px, 292px"
                            : "(min-width: 1024px) 182px, (min-width: 450px) 112px, 80px"
                        }
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  {/* Ovoz tugmasi — faqat avatar VIDEO bo'lganda.
                      Hover'da (va klaviatura fokusida) ko'rinadi. */}
                  {author.video && (
                    <button
                      type="button"
                      onClick={() => setMuted((m) => !m)}
                      aria-label={muted ? "Ovozni yoqish" : "Ovozni o'chirish"}
                      aria-pressed={!muted}
                      className="absolute inset-0 flex items-center justify-center bg-black/45 text-[#EFEFEF] opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      {muted ? (
                        <VolumeX size={28} strokeWidth={1.5} />
                      ) : (
                        <Volume2 size={28} strokeWidth={1.5} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
