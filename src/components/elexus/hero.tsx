"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

type Props = {
  phone: string;
  address: string;
  /** Hero markaziy video (mp4/webm). Video yuklangach shu path bo'ladi. */
  videoSrc?: string;
  /** Video hali yuklanmagan bo'lsa fallback rasm. */
  posterSrc?: string;
};

/**
 * Elexus Home Hero — sodda "Home1" varianti (Figma-ga aynan mos).
 *
 * Boshlang'ich holat:
 *   ┌──────────────────────────────────────────────┐
 *   │ Aloqa uchun:                                 │
 *   │ 90 123 45 67                                 │
 *   │ Tashkent, Aloqa street 28                    │
 *   │                                              │
 *   │              ┌──────────┐                    │
 *   │              │          │   [Mutaxasis pill] │
 *   │              │  VIDEO   │                    │
 *   │              │          │                    │
 *   │              └──────────┘                    │
 *   │                                              │
 *   └──────────────────────────────────────────────┘
 *
 *   - Katta scattered text (Sarviqor...) YO'Q.
 *   - Faqat: kontakt (top-left) + kichik video markazda + button.
 *
 * Scroll animatsiyasi (avvalgi bosqichdan qoldi):
 *   - Sticky 220vh pin.
 *   - Video maydoni 38%→100% width, 76vh→100vh, radius 12→0.
 *   - Kengaygach video ustidan overlay text (address + phone kattalashgan)
 *     0→1 fade-in.
 *   - Button biroz kattalashadi.
 *
 * Kirish animatsiyasi (sahifa yuklanganda):
 *   - Kontakt bloki chapdan slide-in (delay 0.1s, duration 0.9s).
 *   - Video scale-up (delay 0.3s, duration 1.1s).
 *   - Button scale-up (delay 0.6s, duration 0.9s).
 *   - Ease: OUT_EXPO cubic-bezier(0.19, 1, 0.22, 1) — waabi.ai palettidan.
 */

const OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

export default function HeroElexus({
  phone,
  address,
  videoSrc,
  posterSrc = "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1600&q=80",
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

  // Boshlang'ich qatlam (kontakt + button)
  const initialOpacity = useTransform(progress, [0, 0.35], [1, 0]);
  const initialY = useTransform(progress, [0, 0.5], [0, -30]);

  // Video maydoni — kengayadi
  const mediaWidth = useTransform(progress, [0, 1], ["38%", "100%"]);
  const mediaHeight = useTransform(progress, [0, 1], ["76vh", "100vh"]);
  const mediaRadius = useTransform(progress, [0, 1], [12, 0]);
  const gradientOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  // Kengaygan overlay
  const expandedOpacity = useTransform(progress, [0.55, 0.95], [0, 1]);
  const expandedY = useTransform(progress, [0.55, 0.95], [40, 0]);

  // Button
  const buttonScale = useTransform(progress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        {/* ── Boshlang'ich qatlam: kontakt (chap yuqori) ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ opacity: initialOpacity, y: initialY }}
        >
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: OUT_EXPO, delay: 0.1 }}
            className="absolute left-[40px] top-[104px] flex flex-col gap-[6px] sm:left-[60px]"
          >
            <span className="text-[13px] text-black/60">Aloqa uchun:</span>
            <span className="text-[28px] font-bold leading-none text-black sm:text-[32px]">
              {phone}
            </span>
            <span className="text-[13px] font-medium text-black/80 sm:text-[15px]">
              {address}
            </span>
          </motion.div>
        </motion.div>

        {/* ── Markaziy video/rasm — scroll bilan kengayadi ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: OUT_EXPO, delay: 0.3 }}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]"
          style={{
            width: mediaWidth,
            height: mediaHeight,
            borderRadius: mediaRadius,
          }}
        >
          {videoSrc ? (
            <video
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={posterSrc}
              alt="Elexus Gilam showroom"
              className="h-full w-full object-cover"
              draggable={false}
            />
          )}
          {/* Rasm/video ustidagi gradient — kengayganda matn o'qish uchun */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: gradientOpacity,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)",
            }}
          />
        </motion.div>

        {/* ── Kengaygan overlay: address+phone (chap) + description (o'ng) ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex items-center px-[40px] sm:px-[80px]"
          style={{ opacity: expandedOpacity, y: expandedY }}
        >
          <div className="flex w-full items-center justify-between gap-[60px]">
            <div className="flex max-w-[480px] flex-col gap-[12px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
              <span className="text-[24px] font-semibold leading-tight sm:text-[32px]">
                {address.replace("Uzbekistan, ", "")}
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

        {/* ── "Mutaxasis yollash" pill button ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: OUT_EXPO, delay: 0.6 }}
          className="pointer-events-auto absolute left-1/2 top-1/2 z-40 -translate-y-1/2"
          style={{
            scale: buttonScale,
            // Video markazidan +220px o'ng — video o'ng qirrasidan biroz o'tadi
            transform: "translate(200%, -50%)",
          }}
        >
          <button
            type="button"
            className="inline-flex items-center gap-[10px] whitespace-nowrap rounded-full border border-black bg-white/95 px-[24px] py-[14px] text-[15px] font-semibold text-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-transform hover:scale-[1.03]"
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
      </div>
    </section>
  );
}
