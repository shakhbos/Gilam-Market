"use client";

import { motion } from "motion/react";

type Props = {
  phone: string;
  address: string;
  /** Fon video (mp4/webm). Yuklangach shu path bo'ladi. */
  videoSrc?: string;
  /** Video bo'lmasa fallback rasm. */
  posterSrc?: string;
};

/**
 * Elexus New Home Hero (Figma 333:899-908).
 *
 * Struktura (Figma 1728×1037 → responsive):
 *   - Fon: video yoki poster rasm, butun sahifa keng, ~60vh baland
 *   - Chap: Tashkent, Aloqa street 28 (56px) + 90 123 45 67 (56px)
 *   - O'ng: description matni (24px) + "Mutaxasis yollash" 220×60 pill
 *   - Ustida (alohida): sticky header
 *
 * Figma pozitsiyalari (1728 kanvas):
 *   - Chap matn: x=284 (16.4%), y=337-478 (address y=337, phone y=418)
 *   - O'ng matn: x=944 (54.6%), y=342-488 (desc y=342, button y=428)
 *
 * Ease: OUT_EXPO cubic-bezier(0.19, 1, 0.22, 1) — waabi.ai palettidan.
 */

const OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

export default function HeroElexus({
  phone,
  address,
  videoSrc,
  // Vaqtinchalik: /public/elexus/hero.jpg dan rasm oladi. Fayl bo'lmasa
  // Unsplash placeholder ishlatiladi (browser fallback CSS ostida).
  posterSrc = "/elexus/hero.jpg",
}: Props) {
  return (
    <section
      data-section="hero"
      className="relative w-full overflow-hidden bg-black"
      // Header (80px) dan pastda to'liq viewport egallaydi. Barcha ekranlarda
      // baland aksept qiladi (mobile pastroq).
      style={{ height: "calc(100vh - 80px)", minHeight: "520px" }}
    >
      {/* Fon: video yoki rasm */}
      {videoSrc ? (
        <video
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={posterSrc}
          alt="Elexus Gilam showroom"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          onError={(e) => {
            // Fayl yo'q bo'lsa Unsplash placeholder'ga o'tish
            const img = e.currentTarget;
            if (
              !img.src.includes("unsplash")
            ) {
              img.src =
                "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=2400&q=80";
            }
          }}
        />
      )}

      {/* Overlay gradient — matn o'qish uchun (chap va o'ng) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* ── Content grid: chap (address+phone) va o'ng (desc+button) ── */}
      <div
        className="relative z-10 mx-auto grid h-full max-w-[1728px] items-center px-[40px] sm:px-[60px] lg:px-[80px]"
        // Figma: x=284 va x=944 (mos ravishda 16.4% va 54.6% dan chapdan boshlanadi).
        // Grid'da 2 kolonka: 55% (chap) va 45% (o'ng).
        style={{
          gridTemplateColumns: "minmax(0, 55%) minmax(0, 45%)",
          columnGap: "40px",
        }}
      >
        {/* Chap: address (katta) + phone (katta) */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: OUT_EXPO, delay: 0.2 }}
          className="flex flex-col gap-[24px] text-white"
        >
          <span
            className="font-semibold leading-[1.05] tracking-[-0.01em] [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]"
            style={{ fontSize: "clamp(28px, 3.5vw, 56px)" }}
          >
            {address.replace("Uzbekistan, ", "")}
          </span>
          <span
            className="font-bold leading-none tracking-[-0.01em] [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]"
            style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
          >
            {phone}
          </span>
        </motion.div>

        {/* O'ng: description + button */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: OUT_EXPO, delay: 0.35 }}
          className="flex flex-col items-start gap-[36px] text-white"
        >
          <p
            className="font-medium leading-[1.35] [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]"
            style={{ fontSize: "clamp(16px, 1.5vw, 24px)", maxWidth: "484px" }}
          >
            Gilam do&apos;konimizga xush kelibsiz! Biz har qanday
            makoningizning shinam atmosferasini yaratamiz.
          </p>

          {/* Mutaxasis yollash — 220×60 pill (Figma Group 50) */}
          <button
            type="button"
            className="inline-flex h-[60px] items-center gap-[10px] whitespace-nowrap rounded-full border border-white/40 bg-white/95 px-[30px] text-[15px] font-semibold text-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all hover:scale-[1.03] hover:bg-white"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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
      </div>
    </section>
  );
}
