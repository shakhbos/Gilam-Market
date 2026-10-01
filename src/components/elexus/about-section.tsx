"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import Container from "./container";
import SectionTitle from "./section-title";
import { pinGrowStyle, pinGrowVars, usePinGrow } from "./use-pin-grow";

/*
 * Elexus — "О нас" seksiyasi.
 * Figma frame 100:281 · node 240:2600 (Frame 73).
 * ─────────────────────────────────────────────────────────────────────────
 * FIGMA TUZILMASI (1920 freym, kontent 1720, chekka margin 100):
 *   Frame 73   x=100  y=3207  1716×703   ichki gap 30px
 *     sarlavha "О нас"
 *     Group 107
 *       Frame 72  jigarrang panel  1716×591  ·  bg #74301c
 *                 padding: chap 26 · o'ng 185 · yuqori/past 19
 *         Frame 71  flex, gap 31
 *                   Video tepasi matn tepasi bilan, pastki cheti esa
 *                   statistika bilan bir chiziqda (Figma'da 15.5px
 *                   markazlashtirilgan edi — kelishuv bo'yicha TEKIS).
 *                   Buning uchun qatorda `items-start`, chap ustunda esa
 *                   `self-stretch` + `justify-between`: chap ustun qator
 *                   balandligiga cho'ziladi, VIDEO esa hech qachon
 *                   cho'zilmaydi va nisbatini yo'qotmaydi.
 *                   (`items-stretch` qo'ysak, chap ustun videodan baland
 *                   bo'lgan kengliklarda — 1024 va 1440px — video cho'zilib
 *                   nisbati 1.98 dan 0.90 ga tushib ketardi.)
 *           Frame 69  chap ustun  w=377  ·  matn rangi #f4efe9
 *             matn      20px, ikki xatboshi
 *             Frame 68  statistika, gap 14
 *                       yorliq (opacity .5, UPPERCASE) + qiymat (+21px)
 *           Rectangle 78  video  1141×553  (= c4–c11)
 *       Frame 70  panel OSTIDA (mt 618, ml 434 — video bilan bir chiziqda)
 *         progress: yo'lak oq 1141×4 · to'ldirilgan #74301c 440×4 (39%)
 *         izoh: 14px · #7e7c78 · UPPERCASE
 *
 * DIQQAT — bu seksiya 12-kolonka grid'iga tushmaydi:
 *   Panel butun kontent enini egallaydi (1716 ≈ 1720 = 12 kolonka), lekin
 *   ichkarisi padding + flex bilan joylashgan: chap ustun 377, video 1141,
 *   o'ngda 185px jigarrang bo'shliq qoladi. Ya'ni video kontent chetiga
 *   yetmaydi (hero'dan farqli). Shuning uchun grid emas, Figma'dagi
 *   padding/flex tuzilmasi takrorlangan.
 *
 * YUQORIDAGI BO'SHLIQ — 150px (60 emas):
 *   Figma: chegirmalar seksiyasi 3057 da tugaydi, "О нас" 3207 da boshlanadi.
 *   Boshqa seksiyalar orasida 60px, bu yerda 150px.
 *
 * RESPONSIV (Figma'da mobil freym yo'q):
 *   lg+  — Figma tuzilmasi: matn | video yonma-yon
 *   lg'dan past — ustma-ust, panel paddinglari kichrayadi, progress bar
 *   panel ostida to'liq kenglikda.
 */

const STATS = [
  { label: "Год", value: "1998" },
  { label: "Адрес", value: "Тошкент Алока" },
  { label: "В наличии", value: "Больше 500+ вид ковров" },
] as const;

/** Video ko'rilgan ulush — Figma: 440 / 1141 ≈ 38.6%. */
const PROGRESS = "38.6%";

/**
 * Zona kontenti. Hozircha poster rasm; video tayyor bo'lganda shu yerda
 * `kind: "video"` va `src` ni almashtirish yetadi — markup o'zgarmaydi.
 *
 * `position` — Figma kadri: rasm markazdan emas, pastroqdan kesilgan
 * (Figma transformi: h 134.3%, top −24.11% → 24.11/34.3 ≈ 70%).
 */
type AboutMedia = {
  kind: "image" | "video";
  src: string;
  alt: string;
  /** object-position — zona ichidagi kadr. */
  position: string;
  /** Faqat video uchun. */
  poster?: string;
};

const MEDIA: AboutMedia = {
  kind: "video",
  src: "/elexus/about-video.mp4",
  alt: "Elexus ustaxonasi",
  position: "50% 70%",
  poster: "/elexus/about-video-poster.jpg",
};

/**
 * Video shu chegaradan keyin ishga tushadi. Ya'ni zona to'liq ekranga
 * yetganda — undan oldin poster rasm ko'rinib turadi.
 */
const PLAY_AT = 0.98;

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  /** Hozir o'ynayaptimi — har kadrda play() chaqirmaslik uchun. */
  const playingRef = useRef(false);
  /** To'liq ekranga yetdimi — ovoz tugmasi shunda ko'rinadi. */
  const [atFull, setAtFull] = useState(false);
  const atFullRef = useRef(false);
  /** Ovoz yoqiqmi. Brauzer rad etsa `false` bo'lib qoladi. */
  const [sound, setSound] = useState(false);
  /** Sahifada foydalanuvchi faolligi bo'ldimi (bosish/tegish/klaviatura). */
  const gestureRef = useRef(false);

  /*
   * O'sish jarayonini kuzatamiz: zona TO'LIQ EKRANGA yetgandagina video
   * ishga tushadi, orqaga scroll qilinsa to'xtaydi va boshiga qaytadi.
   *
   * `useCallback` bo'sh bog'liqlik bilan — hook uni o'z effektining
   * bog'liqliklarida ushlaydi, har renderda yangi funksiya berilsa effekt
   * qayta ishga tushib, o'lchovlar bekorga takrorlanardi.
   */
  const onProgress = useCallback((t: number) => {
    const v = videoRef.current;
    if (!v) return;

    // Chegarani kesib o'tgandagina setState — onProgress har kadrda
    // chaqiriladi, har safar render qilib o'tirish ortiqcha.
    const full = t >= PLAY_AT;
    if (full !== atFullRef.current) {
      atFullRef.current = full;
      setAtFull(full);
    }

    if (full && !playingRef.current) {
      playingRef.current = true;
      /*
       * Avval OVOZ BILAN o'ynatib ko'ramiz. Brauzerlar foydalanuvchi
       * sahifa bilan muloqot qilmaguncha ovozli avtomatik ijroni bloklaydi
       * (scroll ko'pincha "muloqot" sifatida hisoblanmaydi), shuning uchun
       * rad etilsa ovozsiz qayta urinamiz — video baribir ko'rinadi,
       * foydalanuvchi esa tugma orqali ovozni yoqishi mumkin.
       */
      v.muted = false;
      v.play()
        .then(() => setSound(true))
        .catch(() => {
          v.muted = true;
          setSound(false);
          void v.play().catch(() => {
            playingRef.current = false;
          });
        });
    } else if (!full && playingRef.current) {
      playingRef.current = false;
      v.pause();
      v.currentTime = 0;
    }
  }, []);

  /*
   * Ovozni birinchi imkoniyatda yoqish.
   *
   * Brauzerlar ovozli avtomatik ijroni sahifada "sticky user activation"
   * paydo bo'lmaguncha bloklaydi. Scroll (wheel) bu faollikni BERMAYDI —
   * faqat bosish, tegish yoki klaviatura beradi. Shuning uchun:
   *   • video to'liq ekranga chiqqanda ovoz bilan urinamiz (onProgress)
   *   • rad etilsa ovozsiz o'ynaydi va tugma chiqadi
   *   • foydalanuvchi sahifaning ISTALGAN joyini bosishi bilan shu yerda
   *     ovoz avtomatik yoqiladi — alohida tugma bosish shart emas
   *
   * Listener bir marta ishlaydi va o'zini olib tashlaydi.
   */
  useEffect(() => {
    const ev = ["pointerdown", "keydown", "touchstart"] as const;
    const unlock = () => {
      gestureRef.current = true;
      const v = videoRef.current;
      // Video allaqachon ovozsiz o'ynayotgan bo'lsa — shu zahoti yoqamiz.
      if (v && !v.paused && v.muted) {
        v.muted = false;
        setSound(true);
      }
      ev.forEach((e) => document.removeEventListener(e, unlock));
    };
    ev.forEach((e) => document.addEventListener(e, unlock, { passive: true }));
    return () => ev.forEach((e) => document.removeEventListener(e, unlock));
  }, []);

  /** Ovoz tugmasi — foydalanuvchi bosgani "muloqot" hisoblanadi. */
  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = v.muted;
    v.muted = !next;
    setSound(next);
    if (next) void v.play().catch(() => {});
  }, []);

  // Scroll bilan video to'liq ekranga o'sadi (header'dan pastda), so'ng
  // hold masofasi davomida shunday turadi va seksiya bilan birga ketadi.
  /*
   * holdRatio = 1.6 — uch bosqichga bo'linadi (sahna bo'yiga nisbatan):
   *   0 → 1.0   video o'sadi
   *   1.0 → 1.6 to'liq ekranda turadi (video o'ynaydi)
   *   1.6 → 2.6 portfolio ustidan surilib o'tadi
   * Oxirgi 1.0 ni portfolio `-mt` bilan "yeydi", shuning uchun u
   * hold ichiga qo'shilgan — aks holda video o'sib ulgurmasdan
   * portfolio ustiga chiqib kelardi.
   */
  usePinGrow({
    sectionRef,
    stageRef,
    anchorRef,
    trackRef,
    holdRatio: 1.6,
    onProgress,
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#F4EFE9]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
      data-node-id="240:2600"
    >
      {/* SAHNA — header'dan pastda qotadi. `min-h`: kontent baland bo'lsa
            kesilmasin, past bo'lsa ekranni to'ldirsin. */}
      <div
        ref={stageRef}
        className="sticky top-[60px] flex min-h-[calc(100svh-60px)] flex-col justify-center overflow-hidden py-[60px]"
        style={pinGrowVars as React.CSSProperties}
      >
      <Container>
        <div className="flex flex-col gap-[30px]">
          <SectionTitle nodeId="100:352">О нас</SectionTitle>

          <div>
            {/* Jigarrang panel */}
            <div
              className="bg-[color:var(--elx-bg,#74301c)] py-8 lg:py-[19px]"
              data-node-id="240:2598"
            >
              {/* Panelning gorizontal padding'i YO'Q — ichki grid sahifaning
                    12-kolonkasi bilan aynan bir xil bo'lishi uchun. Matn
                    ustuni o'z pl-[26px] ini oladi (Figma panel padding'i). */}
              <div
                className="flex flex-col gap-10 px-5 lg:grid lg:grid-cols-12 lg:gap-x-[14px] lg:gap-y-0 lg:px-0"
                data-node-id="240:2597"
              >
                {/* Chap ustun — matn va statistika */}
                <div
                  className="flex flex-col gap-10 text-[#f4efe9] lg:col-span-3 lg:col-start-1 lg:gap-[140px] lg:pl-[26px]"
                  data-node-id="240:2586"
                >
                  <div className="flex flex-col gap-[1em] text-[20px] leading-[normal]">
                    <p data-node-id="100:345">
                      Мы начинали с лавки на Чорсу в 1998 году и до сих пор
                      ездим за коврами сами — в Тебриз, Кайсери и Хиву. Из
                      десяти отобранных на месте ковров в салон доезжают шесть.
                    </p>
                    <p>
                      Привозим до четырёх ковров домой и оставляем на выходные.
                      Чистка, реставрация кромки и хранение на лето — для своих
                      клиентов бессрочно.
                    </p>
                  </div>

                  <dl
                    className="flex flex-col gap-[14px] text-[14px] leading-[normal]"
                    data-node-id="240:2585"
                  >
                    {STATS.map((s) => (
                      <div key={s.label}>
                        <dt className="uppercase opacity-50">{s.label}</dt>
                        <dd>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* ─── Video zonasi ───
                      Ichidagi kontent HAR DOIM zonani to'ldiradi:
                        rasm  → object-cover
                        video → object-cover + w/h-full
                      <video> sukut bo'yicha letterbox qiladi (yon tomonlarda
                      bo'sh joy qoldiradi), shuning uchun `object-cover` unga
                      ham aniq berilgan — ertaga haqiqiy video qo'yilganda
                      xuddi rasmdek to'liq qoplaydi.

                      objectPosition — Figma'dagi kadr: u rasmni markazdan
                      emas, pastroqdan kesadi (top -24.11% / overflow 34.3%
                      = 70%). Aks holda odamlarning oyog'i kesilib qolardi. */}
                <div
                  ref={anchorRef}
                  className="relative aspect-[1141/553] w-full lg:col-span-8 lg:col-start-4 lg:max-h-[calc(100svh-320px)]"
                  data-node-id="100:329"
                >
                  {/* O'sadigan qatlam — `--elx-t` 0→1 da manfiy inset olib
                        sahnaning to'rt chetiga yetadi. */}
                  <div
                    className="absolute z-10 overflow-hidden"
                    style={
                      {
                        ...pinGrowStyle,
                        /* Ustidan portfolio surilgani sari ozgina kichrayadi —
                           ortga ketayotgandek tuyuladi. Kichrayish faqat SHU
                           qatlamga beriladi, anchor'ga emas: hook anchor'ni
                           o'lchov mos yozuvlari sifatida ishlatadi, uni
                           transform bilan qimirlatib bo'lmaydi. */
                        transform: "scale(calc(1 - 0.06 * var(--elx-cover)))",
                        transformOrigin: "center",
                      } as React.CSSProperties
                    }
                  >
                  {MEDIA.kind === "video" ? (
                    <video
                      ref={videoRef}
                      src={MEDIA.src}
                      poster={MEDIA.poster}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 size-full object-cover"
                      style={{ objectPosition: MEDIA.position }}
                    />
                  ) : (
                    <Image
                      src={MEDIA.src}
                      alt={MEDIA.alt}
                      fill
                      sizes="(min-width: 1024px) 64vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: MEDIA.position }}
                    />
                  )}

                  {/* Chuqurlik soyasi — ustidan portfolio surilgani sari
                        qorayadi. `pointer-events-none`: tugmani to'smaydi. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 bg-black"
                    style={
                      { opacity: "calc(0.5 * var(--elx-cover))" } as React.CSSProperties
                    }
                  />

                  {/* Ovoz tugmasi — faqat video to'liq ekranga chiqqanda
                        ko'rinadi. Chetdan masofa media bilan birga o'sadi
                        (16px → 40px), xuddi portfoliodagi yozuv kabi. */}
                  {MEDIA.kind === "video" && (
                    <button
                      type="button"
                      onClick={toggleSound}
                      aria-label={sound ? "Ovozni o'chirish" : "Ovozni yoqish"}
                      aria-pressed={sound}
                      className={`absolute z-20 grid size-11 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-[opacity,background-color] duration-500 hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                        atFull ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                      style={{
                        right: "calc(16px + 24px * var(--elx-t))",
                        bottom: "calc(16px + 24px * var(--elx-t))",
                      }}
                    >
                      {sound ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
                          <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
                          <path d="m16.5 9.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                  )}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress + izoh — panel ostida, video bilan bir chiziqda.
                  Figma: ml 434 (= panel pl 26 + chap ustun 377 + gap 31),
                  mt 618 (panel 591 + 27). */}
            <div
              className="mt-[27px] lg:grid lg:grid-cols-12 lg:gap-x-[14px]"
              data-node-id="240:2593"
            >
              <div
                className="h-[4px] w-full bg-white lg:col-span-8 lg:col-start-4"
                role="progressbar"
                aria-valuenow={39}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Video ko'rilgan qismi"
                data-node-id="240:2592"
              >
                <div
                  className="h-full bg-[color:var(--elx-bg,#74301c)]"
                  style={{ width: PROGRESS }}
                />
              </div>
              <p
                className="mt-[10px] text-[14px] uppercase leading-[normal] text-[#7e7c78] lg:col-span-8 lg:col-start-4"
                data-node-id="100:331"
              >
                Видео · мастерская в ELEXUS
              </p>
            </div>
          </div>
        </div>
      </Container>
      </div>

      {/* YO'LAK — pinned scroll masofasi. JS o'chiq bo'lsa balandligi 0
            bo'lib qoladi va seksiya oddiy statik holatda ishlaydi. */}
      <div ref={trackRef} aria-hidden="true" style={{ height: 0 }} />
    </section>
  );
}
