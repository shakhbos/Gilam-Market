"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

type Props = {
  phone: string;
  address: string;
  /** Hero markazidagi rasm — Elexus showroom yoki gilam fotosi. */
  imageSrc?: string;
};

/**
 * Elexus Home Hero — Figma dizaynining aynan qaytarilishi (node 256:1490).
 *
 * TYPOGRAFIK LAYOUT (Figma 1728 kanvas asosida, foizga o'tkazilgan):
 *   Har so'z alohida absolute pozitsiya bilan — chunki intro animatsiyada
 *   har bittasi alohida siljib keladi.
 *
 *   ┌────────────────────────────────────────────┐
 *   │                Sarviqor           ←        │  L: from-left
 *   │                beqasam va         ←        │  L: from-left
 *   │       go'zal   ┌──────┐                    │  L
 *   │     gilamlar   │ IMG  │        Mutax.      │  L        (button)
 *   │                │      │         [○]        │           (small circle)
 *   │                │      │        sizning     │  →  R
 *   │                └──────┘   interiyeringiz   │  →  R
 *   │                uchun maxsus                │  ↓  B
 *   └────────────────────────────────────────────┘
 *
 * INTRO ANIMATION (sahifa yuklanganda 1 marta):
 *   - Chapdagi so'zlar chapdan ichkariga (-80px x → 0), staggered.
 *   - O'ngdagi so'zlar o'ngdan ichkariga (+80px x → 0), staggered.
 *   - "uchun maxsus" pastdan tepaga (60px y → 0).
 *   - Ease: OUT_EXPO cubic-bezier(0.19, 1, 0.22, 1) — waabi.ai palettidan.
 *   - Duration: 1s. Har elementga 60ms stagger delay.
 *
 * SCROLL ANIMATION (keyingi bosqichda scroll qilinganda):
 *   - Sticky pin (220vh section). Progress 0→1 orasida:
 *     • Text bloki opacity 1→0 (0-0.35), scale 1→0.94.
 *     • Rasm 38%→100% width, 76vh→100vh height, radius 12→0.
 *     • Overlay matni (address, phone, description) 0→1 (0.55-0.95).
 *   - Spring smoothing (stiffness 120, damping 30, mass 0.6).
 */

// Har so'z uchun Figma pozitsiyalari (1728 kanvas asosida foizga).
// x,y — element chap yuqori burchagi.
const WORDS: Array<{
  text: string;
  from: "left" | "right" | "bottom";
  x: string;
  y: string;
}> = [
  { text: "Sarviqor",       from: "left",   x: "34.3%", y: "16%" },   // y=122
  { text: "beqasam va",     from: "left",   x: "39.4%", y: "27%" },   // y=192
  { text: "go'zal",         from: "left",   x: "28.2%", y: "39%" },   // y=279
  { text: "gilamlar",       from: "left",   x: "24.1%", y: "52%" },   // y=366
  { text: "sizning",        from: "right",  x: "56.3%", y: "66%" },   // y=465
  { text: "interiyeringiz", from: "right",  x: "52.5%", y: "78%" },   // y=549
  { text: "uchun maxsus",   from: "bottom", x: "42.4%", y: "91%" },   // y=637
];

// waabi.ai palettidan — OUT_EXPO
const OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

export default function HeroElexus({
  phone,
  address,
  imageSrc = "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=2400&q=80",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.6,
  });

  // Boshlang'ich qatlam (text + kontakt)
  const initialOpacity = useTransform(progress, [0, 0.35], [1, 0]);
  const initialScale = useTransform(progress, [0, 0.5], [1, 0.96]);
  const initialY = useTransform(progress, [0, 0.5], [0, -30]);

  // Markaziy rasm — kengayadi
  const imgWidth = useTransform(progress, [0, 1], ["15.3%", "100%"]);   // Figma: 264/1728
  const imgHeight = useTransform(progress, [0, 1], ["55vh", "100vh"]);  // Figma h=388, ~55%
  const imgRadius = useTransform(progress, [0, 1], [0, 0]);
  const gradientOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  // Kengaygan overlay
  const expandedOpacity = useTransform(progress, [0.55, 0.95], [0, 1]);
  const expandedY = useTransform(progress, [0.55, 0.95], [40, 0]);

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        {/* ── Boshlang'ich qatlam (Figma layout) ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: initialOpacity,
            scale: initialScale,
            y: initialY,
          }}
        >
          {/* Aloqa bloki (chap yuqori) */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: OUT_EXPO, delay: 0.1 }}
            className="absolute left-[40px] top-[104px] flex flex-col gap-[6px] sm:left-[60px]"
          >
            <span className="text-[15px] text-black/60">Aloqa uchun:</span>
            <span className="text-[24px] font-bold leading-none text-black">
              {phone}
            </span>
            <span className="text-[13px] font-medium text-black/80">
              {address}
            </span>
          </motion.div>

          {/* So'zlar — figma pozitsiyalarida, intro slide-in animatsiyasi bilan */}
          {WORDS.map((w, i) => {
            const initial =
              w.from === "left"
                ? { opacity: 0, x: -100 }
                : w.from === "right"
                ? { opacity: 0, x: 100 }
                : { opacity: 0, y: 80 };
            return (
              <motion.div
                key={w.text}
                initial={initial}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 1,
                  ease: OUT_EXPO,
                  delay: 0.2 + i * 0.09, // stagger 90ms per word
                }}
                className="pointer-events-none absolute whitespace-nowrap font-black leading-[0.95] tracking-[-0.02em] text-black"
                style={{
                  left: w.x,
                  top: w.y,
                  fontSize: "clamp(36px, 4.85vw, 70px)", // 70px on 1440+ screens
                }}
              >
                {w.text}
              </motion.div>
            );
          })}

          {/* Mutaxasis yollash pill button — Figma: 972,303 (~56.3%, 43%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: OUT_EXPO, delay: 0.9 }}
            className="pointer-events-auto absolute z-20"
            style={{ left: "56.3%", top: "43%" }}
          >
            <button
              type="button"
              className="inline-flex items-center gap-[10px] rounded-full border border-black bg-white/95 px-[24px] py-[14px] text-[15px] font-semibold text-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-transform hover:scale-[1.03]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 11h16v3a5 5 0 01-5 5H9a5 5 0 01-5-5v-3z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M7 8v-.5M12 8V6M17 8v-.5M4 22h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              Mutaxasis yollash
            </button>
          </motion.div>

          {/* Kichik dekorativ doira (Figma image 4: 972,376) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: OUT_EXPO, delay: 1.1 }}
            className="pointer-events-none absolute z-10 h-[80px] w-[80px] rounded-full border border-black/10 bg-gradient-to-br from-[#F5B78F] to-[#D48258]"
            style={{ left: "56.3%", top: "53%" }}
          />
        </motion.div>

        {/* ── Markaziy rasm — scroll bilan kengayadi ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: OUT_EXPO, delay: 0.3 }}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]"
          style={{
            width: imgWidth,
            height: imgHeight,
            borderRadius: imgRadius,
          }}
        >
          <img
            src={imageSrc}
            alt="Elexus Gilam showroom"
            className="h-full w-full object-cover"
            draggable={false}
          />
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: gradientOpacity,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)",
            }}
          />
        </motion.div>

        {/* ── Kengaygan overlay (scroll oxirida) ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex items-center px-[40px] sm:px-[80px]"
          style={{ opacity: expandedOpacity, y: expandedY }}
        >
          <div className="flex w-full items-center justify-between gap-[60px]">
            <div className="flex max-w-[480px] flex-col gap-[12px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
              <span className="text-[24px] font-semibold leading-tight sm:text-[32px]">
                {address.replace("Uzbekistan, ", "").replace(", ", ", ")}
              </span>
              <span className="text-[36px] font-bold leading-none sm:text-[48px]">
                {phone}
              </span>
            </div>
            <div className="hidden max-w-[520px] flex-col items-start gap-[24px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] md:flex">
              <p className="text-[16px] font-medium leading-[1.4] sm:text-[18px]">
                Gilam do&apos;konimizga xush kelibsiz! Biz har qanday
                makoningizning shinam atmosferasini yaratamiz.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
