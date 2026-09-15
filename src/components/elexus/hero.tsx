"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

type Props = {
  phone: string;
  address: string;
  /** Hero markazidagi rasm. Elexus showroom fotosi. */
  imageSrc?: string;
};

/**
 * Elexus Home Hero — waabi.ai uslubidagi scroll-linked expand effekti.
 *
 * Boshlanish (scrollY=0):
 *   - Fon: katta yozuv "Sarviqor beqasam va go'zal gilamlar sizning
 *     interiyeringiz uchun maxsus" (o'ta katta bold typografiya).
 *   - Markazda: kichik rasm (~38% width, 76vh high) — showroom fotosi.
 *   - Chap yuqorida: "Aloqa uchun / phone / address" (kichik).
 *   - O'ng markazida: "Mutaxasis yollash" pill button.
 *
 * Scroll (progress 0→1):
 *   - Katta yozuv opacity 1→0 (0-0.35 progress oralig'ida) + biroz upward siljish.
 *   - Rasm width 38%→100%, height 76vh→100vh, radius 12→0.
 *   - Overlay matni (address + phone + description) opacity 0→1
 *     (0.55-0.95 progress oralig'ida) — kechikish bilan chiqadi.
 *   - "Mutaxasis yollash" tugmasi doim ko'rinadi — biroz kattalashadi.
 *
 * Easing: waabi.ai tahlilidan olingan spring smoothing (stiffness 120,
 * damping 30, mass 0.6) — juda yumshoq his qiladi.
 *
 * Sticky pin: section 220vh balandlikda, ichkarida `sticky top-0 h-screen`
 * container. Foydalanuvchi ~120vh scroll qilib animatsiyani ko'radi.
 */
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

  // Spring smoothing — scroll yumshoq bo'lsin
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.6,
  });

  // ── Boshlang'ich qatlam (big headline + small contact) ─────────────
  const initialOpacity = useTransform(progress, [0, 0.35], [1, 0]);
  const initialScale = useTransform(progress, [0, 0.5], [1, 0.96]);
  const initialY = useTransform(progress, [0, 0.5], [0, -30]);

  // ── Markaziy rasm — kengayadi ──────────────────────────────────────
  const imgWidth = useTransform(progress, [0, 1], ["38%", "100%"]);
  const imgHeight = useTransform(progress, [0, 1], ["76vh", "100vh"]);
  const imgRadius = useTransform(progress, [0, 1], [12, 0]);
  const gradientOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  // ── Kengaygan holat overlay — address + phone + description ────────
  const expandedOpacity = useTransform(progress, [0.55, 0.95], [0, 1]);
  const expandedY = useTransform(progress, [0.55, 0.95], [40, 0]);

  // ── Button — doim ko'rinadi, biroz kattalashadi ─────────────────
  const buttonScale = useTransform(progress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        {/* ── Boshlang'ich qatlam: big text + small contact ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: initialOpacity,
            scale: initialScale,
            y: initialY,
          }}
        >
          {/* Aloqa bloki (chap yuqori) */}
          <div className="absolute left-[40px] top-[104px] flex flex-col gap-[6px] sm:left-[60px]">
            <span className="text-[13px] text-black/60">Aloqa uchun:</span>
            <span className="text-[24px] font-bold leading-none text-black">
              {phone}
            </span>
            <span className="text-[13px] font-medium text-black/80">
              {address}
            </span>
          </div>

          {/* Katta headline — markazda */}
          <div className="flex h-full items-center justify-center px-[40px]">
            <h1
              className="text-center font-black leading-[0.95] tracking-[-0.02em] text-black"
              style={{ fontSize: "clamp(56px, 8.5vw, 148px)" }}
            >
              Sarviqor beqasam va
              <br />
              go&apos;zal gilamlar
              <br />
              sizning interiyeringiz
              <br />
              uchun maxsus
            </h1>
          </div>
        </motion.div>

        {/* ── Markaziy rasm — scroll bilan kengayadi ── */}
        <motion.div
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
          {/* Rasm ustidagi gradient — matn o'qish uchun (kengayganda paydo bo'ladi) */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: gradientOpacity,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)",
            }}
          />
        </motion.div>

        {/* ── Kengaygan overlay: address+phone (chap) va description (o'ng) ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex items-center px-[40px] sm:px-[80px]"
          style={{ opacity: expandedOpacity, y: expandedY }}
        >
          <div className="flex w-full items-center justify-between gap-[60px]">
            {/* Chap: address + phone (kattalashib overlay bo'ladi) */}
            <div className="flex max-w-[480px] flex-col gap-[12px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
              <span className="text-[24px] font-semibold leading-tight sm:text-[32px]">
                {address.replace("Uzbekistan, ", "").replace(", ", ", ")}
              </span>
              <span className="text-[36px] font-bold leading-none sm:text-[48px]">
                {phone}
              </span>
            </div>

            {/* O'ng: description */}
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
          className="pointer-events-auto absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
          style={{ scale: buttonScale }}
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
      </div>
    </section>
  );
}
