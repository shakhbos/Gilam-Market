"use client";

import { useEffect, type RefObject } from "react";

/*
 * Scroll bilan media'ni to'liq ekranga o'stiruvchi hook.
 * ─────────────────────────────────────────────────────────────────────────
 * Seksiyaga kelganda media o'z grid katagidan chiqib, yumshoq o'sib butun
 * ekranni egallaydi (header'dan pastda), keyin belgilangan masofa davomida
 * shu holatda turadi va seksiya tugagach o'zi bilan birga yuqoriga ketadi.
 *
 * TUZILMA (chaqiruvchi komponentda bo'lishi kerak):
 *   <section ref={sectionRef}>
 *     <div ref={stageRef} class="sticky top-[60px] min-h-[calc(100svh-60px)]">
 *        ...layout...
 *        <div ref={anchorRef} class="relative aspect-[...]">
 *           <div style={{ left: "calc(-1 * var(--elx-ml) * var(--elx-t))", ... }}>
 *              media
 *           </div>
 *        </div>
 *     </div>
 *     <div ref={trackRef} aria-hidden style={{height:0}} />
 *   </section>
 *
 * NEGA MANFIY INSET: `--elx-t` 0 bo'lganda hamma masofa nolga ko'payadi va
 * media anchor'ni roppa-rosa to'ldiradi — ya'ni t=0 bu dizayn layoutining
 * O'ZI. Shuning uchun SSR'da, JS o'chiq brauzerda va reduced-motion'da
 * sahifa hech qanday o'lchovsiz to'g'ri chiqadi, grid geometriyasi esa
 * bitta joyda (Container + grid sinflari) qoladi.
 */

/** Header bar balandligi — sahna shundan pastda qotadi. */
export const HEADER_H = 60;

/** Har kadrda nishonga yaqinlashish ulushi. Kichik son = yumshoqroq. */
const DAMP = 0.085;

/** easeInOutCubic — o'sish boshi va oxirida sekinlashadi. */
const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export type PinGrowOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  anchorRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  /** O'sishga ketadigan scroll, sahna bo'yiga nisbatan. */
  growRatio?: number;
  /** O'sib bo'lgandan keyin to'liq ekranda turish masofasi. */
  holdRatio?: number;
  /** Qaysi kenglikdan boshlab yoqiladi. */
  minWidth?: number;
  /** Har o'sish qadamida chaqiriladi (0→1). Progress bar uchun qulay. */
  onProgress?: (t: number) => void;
};

export function usePinGrow({
  sectionRef,
  stageRef,
  anchorRef,
  trackRef,
  growRatio = 1,
  holdRatio = 0.6,
  minWidth = 1024,
  onProgress,
}: PinGrowOptions) {
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const anchor = anchorRef.current;
    const track = trackRef.current;
    if (!section || !stage || !anchor || !track) return;

    const wide = window.matchMedia(`(min-width: ${minWidth}px)`);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let shown = 0;
    let enabled = false;

    const setVar = (n: string, v: string) => stage.style.setProperty(n, v);

    const disable = () => {
      enabled = false;
      track.style.height = "0px";
      shown = 0;
      setVar("--elx-t", "0");
      setVar("--elx-cover", "0");
      onProgress?.(0);
    };

    let grow = 0;

    const tick = (snap = false) => {
      frame = 0;
      if (!enabled) return;
      // scrolled = scrollY − (seksiya tepasi − header). `rect.top` ekranga
      // nisbatan bo'lgani uchun ayirma soddalashadi va hech nima keshlanmaydi
      // (sahifa balandligi rasm yuklanishi bilan o'zgarib turadi).
      const scrolled = HEADER_H - section.getBoundingClientRect().top;
      const target = ease(Math.min(1, Math.max(0, scrolled / grow)));
      if (snap) shown = target;
      else shown += (target - shown) * DAMP;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      setVar("--elx-t", shown.toFixed(4));
      onProgress?.(shown);

      /*
       * COVER — keyingi seksiya bu seksiyani qancha yopganini o'lchaydi.
       * Sahna qotib turgani uchun keyingi seksiya uning USTIDAN suriladi
       * (parallaks his shundan keladi). Chuqurlik sezilishi uchun ustiga
       * qorayish va ozgina kichrayish beramiz — ikkalasi ham CSS
       * o'zgaruvchisi orqali, ya'ni React qayta render qilmaydi.
       */
      const next = section.nextElementSibling as HTMLElement | null;
      if (next) {
        const nt = next.getBoundingClientRect().top - HEADER_H;
        const h = stage.getBoundingClientRect().height || 1;
        const cover = Math.min(1, Math.max(0, 1 - nt / h));
        setVar("--elx-cover", cover.toFixed(4));
      }

      if (shown !== target) frame = requestAnimationFrame(() => tick());
    };

    const measure = () => {
      if (!wide.matches || still.matches) {
        disable();
        return;
      }
      const s = stage.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      // Anchor chetidan sahna chetigacha masofalar. Sahna qotgan bo'lsa ham
      // ikkala to'rtburchak birga siljiydi — farq o'zgarmaydi.
      setVar("--elx-ml", `${a.left - s.left}px`);
      setVar("--elx-mt", `${a.top - s.top}px`);
      setVar("--elx-mr", `${s.right - a.right}px`);
      setVar("--elx-mb", `${s.bottom - a.bottom}px`);

      grow = s.height * growRatio;
      track.style.height = `${grow + s.height * holdRatio}px`;
      enabled = true;
      if (frame) cancelAnimationFrame(frame);
      tick(true);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => tick());
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(anchor);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    wide.addEventListener("change", measure);
    still.addEventListener("change", measure);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      wide.removeEventListener("change", measure);
      still.removeEventListener("change", measure);
    };
  }, [sectionRef, stageRef, anchorRef, trackRef, growRatio, holdRatio, minWidth, onProgress]);
}

/** Media qatlamiga beriladigan inline style — `--elx-t` bo'yicha o'sadi. */
export const pinGrowStyle = {
  left: "calc(-1 * var(--elx-ml) * var(--elx-t))",
  top: "calc(-1 * var(--elx-mt) * var(--elx-t))",
  right: "calc(-1 * var(--elx-mr) * var(--elx-t))",
  bottom: "calc(-1 * var(--elx-mb) * var(--elx-t))",
} as const;

/** Sahnaga beriladigan boshlang'ich CSS o'zgaruvchilari (JS o'chiq holat). */
export const pinGrowVars = {
  "--elx-t": 0,
  "--elx-cover": 0,
  "--elx-ml": "0px",
  "--elx-mt": "0px",
  "--elx-mr": "0px",
  "--elx-mb": "0px",
} as Record<string, string | number>;
