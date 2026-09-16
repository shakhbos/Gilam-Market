"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

type Props = {
  phone: string;
  address: string;
  /** Hero markaziy video (mp4/webm). Video yuklangach shu path bo'ladi. */
  videoSrc?: string;
  /** Video yuklanmagan bo'lsa fallback rasm. */
  posterSrc?: string;
};

/**
 * Elexus Home1 Hero — Figma'ga aynan mos o'lchamlar.
 *
 * FIGMA REFERENS (1728 kanvas, 780 hero balandligi):
 *   - Video card: 264 × 388 px, position x=683 y=263 (Rectangle 49)
 *     → ekran markazidan biroz chapda, aspect 2:3 portret.
 *   - Mutaxasis pill button: 220 × 60, x=972 y=303 → video o'ng qirrasi
 *     yonida (video tugaydigan x=947 dan ~25 px o'ngda), yuqori qatorda.
 *   - Aloqa bloki: x=60 y=104 → chap yuqori.
 *   - Katta scattered text YO'Q (Home1 varianti).
 *
 * O'lchamlar responsive:
 *   - width='clamp(220px, 15.3vw, 264px)' — Figma qiymatiga qarab.
 *   - height='clamp(320px, 38vh, 388px)'.
 *
 * ANIMATSIYA:
 *   - Kirish: kontakt chapdan slide, video scale-up, button scale-up.
 *   - Scroll: sticky 220vh pin. Video 264px→100vw ga kengayadi.
 *     Kontakt fade-out. Overlay text fade-in.
 */

const OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

export default function HeroElexus({
  phone,
  address,
  videoSrc,
  posterSrc = "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80",
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

  // Video maydoni — Figma o'lchami (264×388) → viewport'ga kengayadi
  // Boshlanish: 264/1728 = 15.3% ekran keng
  //             388/1080 = 36% ekran baland (aspect 2:3 saqlanadi)
  // Oxiri: 100% × 100vh
  const mediaWidth = useTransform(progress, [0, 1], ["15.3%", "100%"]);
  const mediaHeight = useTransform(progress, [0, 1], ["55vh", "100vh"]);
  const mediaRadius = useTransform(progress, [0, 1], [8, 0]);
  const gradientOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  // Kengaygan overlay (scroll oxirida)
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
        {/* ── Kontakt bloki (chap yuqori) ── */}
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
            <span className="text-[13px] leading-none text-black/60">
              Aloqa uchun:
            </span>
            <span className="text-[24px] font-bold leading-none text-black">
              {phone}
            </span>
            <span className="text-[13px] font-medium leading-tight text-black/80">
              {address}
            </span>
          </motion.div>
        </motion.div>

        {/* ── Markaziy video card (Figma: 264×388, aspect 2:3 portret) ── */}
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
              alt="Elexus Gilam"
              className="h-full w-full object-cover"
              draggable={false}
            />
          )}
          {/* Kengaygach paydo bo'ladigan gradient */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: gradientOpacity,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)",
            }}
          />
        </motion.div>

        {/* ── "Mutaxasis yollash" pill (Figma: 220×60 at x=972 y=303) ──
            Video card markaziy (x=815 nazariy), o'ng qirrasi ~x=947. Button
            x=972 (25px keyin). Ekran markazidan +180px o'ng, video top qismi
            yonida (55vh video, y=303 → video ustki 1/4 dagi). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: OUT_EXPO, delay: 0.6 }}
          className="pointer-events-auto absolute left-1/2 z-30"
          style={{
            top: "calc(50% - 22vh)",       // video markazidan tepa-yuqori
            marginLeft: "calc(7.65vw + 30px)", // video o'ng qirrasidan (video yarim keng 7.65vw) + 30px
            opacity: initialOpacity,
          }}
        >
          <button
            type="button"
            className="inline-flex h-[60px] items-center gap-[10px] whitespace-nowrap rounded-full border border-black bg-white px-[30px] text-[15px] font-semibold text-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.03]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

        {/* ── Kengaygan overlay (scroll oxirida) ── */}
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
      </div>
    </section>
  );
}
