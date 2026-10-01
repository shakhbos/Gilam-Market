"use client";

import Container from "./container";
import { Link } from "@/i18n/routing";
import { Heart, ShoppingCart, UserCircle2 } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useMounted } from "@/hooks/use-mounted";

/*
 * Elexus Header (Navbar) — Figma frame 100:281, node 100:450 (Group 24).
 * ─────────────────────────────────────────────────────────────────────────
 * FIGMA LAYOUT GRID — 12 kolonka · 14px gutter · 1720px kontent.
 *   Freym 1920px, chekka margin 100px → kontent 1720px, kolonka eni 130.5px.
 *   Grid faqat taxmin emas — dizaynning boshqa bo'limlaridan tasdiqlangan:
 *     mahsulot kartalari  x=100, 535, 967, 1402  → c1, c4, c7, c10 (3 kolonka)
 *     uslublar kartalari  x=100, 389, 678, 967, 1256, 1545
 *                                                → c1, c3, c5, c7, c9, c11 (2 kolonka)
 *
 *   Header elementlari (kontentga nisbatan x):
 *     Logo           0     → c1  (grid'ning chap cheti)
 *     Каталог pill   145   → c2  (c2 = 144.5 — aniq tushadi)
 *     Вызвать pill   1278  ┐
 *     AR pill        1448  ├ kolonkaga bog'lanmagan: bular o'ng chetga
 *     Ikonkalar      1588  ┘ tekislangan yagona blok:
 *                            170 + 120 + 20 + 132 = 442
 *                            1720 − 442 = 1278 ✓ (Вызвать boshlanishi)
 *
 *   Shuning uchun: CHAP tomon kolonkaga bog'lanadi (c1, c2), O'NG tomon
 *   o'ng chetga tekislanadi (justify-self-end). Bu dizaynning o'zi.
 *
 *   Kolonkaga bog'lash faqat xl+ (≥1280px) da yoqiladi: tor ekranda kolonka
 *   eni 10-20px ga tushadi va c2 logo ustiga chiqib ketadi. xl'dan pastda
 *   logo + Каталог oddiy oqimda (14px oraliq) turadi.
 *
 * ADAPTIVE — HAQIQIY O'LCHOV (measured), taxmin emas:
 *   Qoida bitta: Каталог pill'ning o'ng cheti bilan o'ng blokning chap cheti
 *   orasidagi masofa 40px dan pastga tushsa — o'ngdan bitta element
 *   yashiriladi. Element "sig'masa" emas, "40px ga yaqinlashsa" yashiriladi.
 *
 *   Har resize'da nav 0-bosqichdan qayta boshlanadi va masofa 40px dan oshgunicha
 *   bosqichma-bosqich tushadi → ekran kengaytirilganda elementlar avtomatik
 *   qaytadi. Barchasi bitta layout pass ichida (useLayoutEffect, paint'dan
 *   oldin), shuning uchun flapping ham, ko'rinadigan sakrash ham yo'q.
 *
 *   ┌────────┬──────────────────────────┬─────────────────────────────────┐
 *   │ Bosqich│ Yashiriladi              │ Ko'rinib turadi                 │
 *   ├────────┼──────────────────────────┼─────────────────────────────────┤
 *   │   0    │ —                        │ Каталог + Вызвать + AR + 🤍👤🛒  │
 *   │   1    │ Вызвать специалиста      │ Каталог + AR + 🤍👤🛒            │
 *   │   2    │ + AR-Примерка            │ Каталог + 🤍👤🛒                 │
 *   │   3    │ + "Каталог ковров" matni │ ☰ + 🤍👤🛒                       │
 *   └────────┴──────────────────────────┴─────────────────────────────────┘
 *
 *   Nega JS: matn kengligi shriftga (Inter Tight async yuklanadi) va tilga
 *   bog'liq — CSS bu kengliklarni o'lchay olmaydi, faqat container kengligini
 *   biladi. CSS hardcoded threshold = taxmin; bu yerda esa
 *   getBoundingClientRect bilan real masofa olinadi.
 *
 *   CSS container query'lar FALLBACK sifatida qoldirilgan: hydration'dan
 *   oldingi birinchi frame va JS o'chirilgan holat uchun. JS o'lchagach
 *   nav'ga data-elx-level qo'yiladi va `:not([data-elx-level])` orqali
 *   fallback o'zini o'chiradi (ikki qoida bir-biriga urilmaydi).
 *
 * BURGER:
 *   2 chiziqli — hover'da bitta chiziqqa birlashadi (translate-y). "Каталог
 *   ковров" butun pill (matn + burger) — bosilganda /catalog'ga olib boradi.
 *
 * O'LCHAM VA JOYLASHUV (Figma Rectangle 56 — y=20, h=60):
 *   Bar qat'iy 60px: eng baland element 40px'lik pill + py-[10px].
 *   Tepadan 20px pastda suzadi va scroll'da ham shu 20px'da qotib turadi —
 *   sticky wrapper `top-0` + shaffof `pt-5` orqali (fon wrapper'da emas,
 *   ichki bar'da, aks holda 20px'lik yo'lak ham bo'yalib ketardi).
 *
 * STYLING:
 *   bg #74301c · text #e0caab · font-weight 500 (Medium) · z-50
 *   Logo 32px SemiBold, tracking −0.96px · Вызвать/AR opacity 40%
 *   — barchasi Figma qiymatlari (avval #5E2C1A/#EFEFEF/300 edi).
 *
 * VARIANT — `variant` prop:
 *   "brand" (sukut) — jigarrang fon, #e0caab matn. Bosh sahifa (hero
 *   ustida), Figma frame 100:281 · node 100:450.
 *   "light" — shaffof/krem fon, qora matn. Ichki sahifalar (masalan
 *   /catalog), Figma frame 100:625 · node 100:790 — bu yerda bar hero fonisiz,
 *   sahifaning o'zi krem (#F4EFE9) bo'lgani uchun bar ham krem ustida qora
 *   matn bilan chiziladi (Rectangle 56 shu freymda ham bor, lekin ko'zga
 *   ko'rinmaydi — sahifa foni bilan bir xil rangda).
 */

/** Каталог pill bilan o'ng blok orasidagi minimal masofa (Figma qoidasi emas — mahsulot qoidasi). */
const MIN_CLUSTER_GAP = 40;

/** Yashirish bosqichlari: 0 = hammasi ko'rinadi, 3 = maksimal yashirilgan. */
const MAX_LEVEL = 3;

/** SSR'da useLayoutEffect ogohlantirish beradi — server'da useEffect'ga tushamiz. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Animatsiyalangan 2-chiziqli burger — hover'da bitta chiziqqa birlashadi. */
function AnimatedTwoLineBurger() {
  return (
    <span
      className="relative inline-flex h-6 w-6 items-center justify-center"
      aria-hidden="true"
    >
      <span className="absolute block h-[1px] w-4 -translate-y-[2px] bg-current transition-transform duration-300 ease-out group-hover:translate-y-0" />
      <span className="absolute block h-[1px] w-4 translate-y-[2px] bg-current transition-transform duration-300 ease-out group-hover:translate-y-0" />
    </span>
  );
}

export default function Header({
  variant = "brand",
}: {
  variant?: "brand" | "light";
}) {
  const navRef = useRef<HTMLElement>(null);
  const katalogRef = useRef<HTMLAnchorElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  /** Oxirgi o'lchangan nav kengligi — ResizeObserver'ni bekorga qaytarmaslik uchun. */
  const lastWidth = useRef(-1);

  // `mounted` dan oldin badge HAR DOIM yashirin — qarang use-mounted.ts
  // izohi (hydration mismatch'ning oldini olish uchun, StoreProvider'ning
  // savatni localStorage'dan hydrate qilish tezligiga bog'liq emas).
  const mounted = useMounted();
  const cartCount = useAppSelector((state) =>
    state.cartElexus.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  /**
   * Savat ikonkasiga "bump" animatsiyasi — toast o'rniga (2026-10-01 user
   * so'rovi: popup kerak emas, lekin qo'shilgani ko'rinib turishi kerak).
   * `addCounter`ni (faqat HAQIQIY `addElexusCartItem`da o'zgaradi, localStorage
   * hydrate'da EMAS — qarang cart-elexus-slice.ts) kuzatamiz, u o'zgarganda
   * `bumpKey`ni oshiramiz. `bumpKey`ning o'zi pastda ikonka wrapper'iga
   * `key` sifatida beriladi — React elementni QAYTA MONTAJ qiladi, shu
   * orqali CSS animatsiya har safar ASL holatidan qayta boshlanadi (klass
   * qo'shib-olib tashlashga hojat yo'q). Boshlang'ich holatda (`bumpKey===0`)
   * animatsiya klassi UMUMAN qo'yilmaydi — aks holda sahifa HAR ochilganda
   * (birinchi montajning o'zida) ikonka bekorga "sakrab" ketardi.
   */
  const addCounter = useAppSelector((state) => state.cartElexus.addCounter);
  const prevAddCounterRef = useRef(addCounter);
  const [bumpKey, setBumpKey] = useState(0);
  useEffect(() => {
    if (addCounter !== prevAddCounterRef.current) {
      prevAddCounterRef.current = addCounter;
      setBumpKey((k) => k + 1);
    }
  }, [addCounter]);

  /**
   * Nav'ni 0-bosqichdan boshlab, Каталог pill bilan o'ng blok orasida kamida
   * 40px qolgunicha bosqichma-bosqich tushiradi.
   *
   * To'g'ridan-to'g'ri IKKI ELEMENT ORASIDAGI masofa o'lchanadi (klaster
   * kengliklari emas) — shuning uchun xl+ da chap tomon `display: contents`
   * bilan grid item'larga ajralsa ham o'lchov to'g'ri qoladi.
   *
   * getBoundingClientRect o'qilishi layoutni majburan qayta hisoblaydi,
   * shuning uchun har iteratsiyada yangi bosqichning haqiqiy holati olinadi.
   */
  const recalc = useCallback(() => {
    const nav = navRef.current;
    const katalog = katalogRef.current;
    const right = rightRef.current;
    if (!nav || !katalog || !right) return;

    const gap = () =>
      right.getBoundingClientRect().left -
      katalog.getBoundingClientRect().right;

    let level = 0;
    nav.setAttribute("data-elx-level", "0");
    // −0.5 — sub-pixel yumaloqlash chegarada tebranish keltirmasligi uchun.
    while (level < MAX_LEVEL && gap() < MIN_CLUSTER_GAP - 0.5) {
      level += 1;
      nav.setAttribute("data-elx-level", String(level));
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    recalc();

    const observer = new ResizeObserver(() => {
      // Faqat kenglik o'zgarganda qayta hisoblaymiz. Bosqich almashishi nav
      // balandligini o'zgartirsa, RO qayta chaqiriladi — bu guard cheksiz
      // loop'ni (va brauzerning "ResizeObserver loop" xatosini) to'xtatadi.
      const width = nav.clientWidth;
      if (width === lastWidth.current) return;
      lastWidth.current = width;
      recalc();
    });
    observer.observe(nav);

    // Shrift yuklanishi matn kengligini o'zgartiradi, lekin nav kengligini
    // o'zgartirmaydi — shuning uchun guard'dan o'tmaydigan alohida chaqiruv.
    document.fonts?.ready.then(recalc).catch(() => {});

    return () => observer.disconnect();
  }, [recalc]);

  return (
    <>
      <style>{`
        /* Container = wrapper (px-5 shu yerda, ya'ni content box === nav kengligi). */
        .elx-nav-scope { container-type: inline-size; container-name: elxnav; }

        /* JS o'lchagan aniq bosqichlar.
           2-bosqichda alohida .elx-ar emas, butun .elx-pills guruhi
           yashiriladi: aks holda bo'sh (0 kenglikli) guruh qolib, undan
           keyingi 20px gap ikonkalarni bekorga surib yuboradi. */
        .elx-nav[data-elx-level="1"] .elx-call { display: none; }
        .elx-nav[data-elx-level="2"] .elx-pills,
        .elx-nav[data-elx-level="3"] .elx-pills { display: none; }
        .elx-nav[data-elx-level="3"] .elx-katalog-text { display: none; }

        /* FALLBACK — hydration oldidagi birinchi frame va JS o'chirilgan holat.
           Thresholdlar Chrome'da REAL o'lchangan (ru locale, Inter Tight,
           logo 600, pill px-15), container (nav) kengligi bo'yicha — viewport
           emas (px-5 tufayli viewport'dan 40px kam):
             lvl 0 uchun kerak: navW ≥ 715  (viewport ~798px)
             lvl 1 uchun kerak: navW ≥ 526  (viewport ~586px)
             lvl 2 uchun kerak: navW ≥ 390  (viewport ~435px)
           (Logo 32px ga o'tgach va container padding uzluksiz bo'lgach
            qayta o'lchangan.)
           Bu thresholdlar xl'dan pastdagi (oddiy oqim) holat uchun — xl+ da
           har doim lvl 0. JS ishga tushgach data-elx-level qo'yiladi va bu
           bloklar o'zini o'chiradi. */
        @container elxnav (max-width: 714px) {
          .elx-nav:not([data-elx-level]) .elx-call { display: none; }
        }
        @container elxnav (max-width: 525px) {
          .elx-nav:not([data-elx-level]) .elx-pills { display: none; }
        }
        @container elxnav (max-width: 389px) {
          .elx-nav:not([data-elx-level]) .elx-katalog-text { display: none; }
        }

        /* Tap target'ni 44px ga kengaytiradi — layoutga ta'sir qilmaydi,
           shuning uchun o'lchov natijasini ham buzmaydi. */
        .elx-hit { position: relative; }
        .elx-hit::after { content: ""; position: absolute; inset: -11px; }

        /* Savatga qo'shilganda ikonka "bump"i — qarang yuqoridagi bumpKey
           izohi. Spring-ga o'xshash ortiqcha-sakrash (overshoot) effekti
           uchun cubic-bezier 1dan oshadi. */
        @keyframes elx-cart-bump {
          0% { transform: scale(1); }
          40% { transform: scale(1.32); }
          65% { transform: scale(0.94); }
          100% { transform: scale(1); }
        }
        .elx-cart-bump { animation: elx-cart-bump 420ms cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

      {/* `sticky top-0` — bar tepaga TAQALIB qotadi.
            Boshlang'ich 20px'lik bo'shliq (Figma Rectangle 56: y=20) bu yerda
            emas, <main> ning `pt-5` ida: u header'dan TASHQARIDA bo'lgani
            uchun scroll bilan yo'qoladi va bar top:0 ga borib taqaladi.
            Agar 20px shu sticky element ichida bo'lsa, u hech qachon
            yo'qolmaydi va bar qimirlamay qolar edi. */}
      <header className="sticky top-0 z-50 w-full">
        {/* Fon `--elx-bg` dan — home-elexus.tsx da bitta joyda belgilanadi,
              shuning uchun sahifa foni bilan har doim bir xil bo'ladi.
              "light" variant — ichki sahifalar krem fonda, qora matn bilan. */}
        <div
          className={
            variant === "light"
              ? "w-full bg-[#F4EFE9] text-black"
              : "w-full bg-[color:var(--elx-bg,#74301c)] text-[#e0caab]"
          }
          style={{
            fontFamily: "var(--font-inter-tight), Inter, sans-serif",
            fontWeight: 500,
          }}
          data-node-id="100:451"
          data-elx-bar=""
        >
          <Container className="elx-nav-scope">
            {/* py-[10px]: Figma'da header qat'iy 60px va eng baland element —
                40px'lik pill. (60 − 40) / 2 = 10px. Hech bir element header'ni
                60px'dan kattalashtirmaydi. */}
            <nav
              ref={navRef}
              className="elx-nav grid grid-cols-12 items-center gap-x-[14px] py-[10px]"
            >
              {/* ─── CHAP ───
                  xl'dan pastda: logo + Каталог bitta flex klaster (oddiy oqim).
                  xl+ da `contents` — wrapper yo'qoladi, bolalari nav'ning o'z
                  grid item'lariga aylanadi va Figma kolonkalariga bog'lanadi
                  (logo c1, Каталог c2). */}
              <div className="col-span-6 flex items-center justify-self-start gap-3 md:gap-[14px] xl:contents">
                <Link
                  href="/"
                  className="whitespace-nowrap text-[26px] font-semibold leading-none tracking-[-0.96px] transition-opacity duration-150 hover:opacity-80 sm:text-[28px] md:text-[32px] xl:col-start-1 xl:justify-self-start"
                  data-node-id="100:454"
                >
                  Elexus
                </Link>
                {/* Pill — Figma 100:460: h 40px, px 15px, matn↔ikonka oralig'i 16px.
                    Kengligi kontentdan kelib chiqadi: 15 + 100 + 16 + 24 + 15 = 170px.
                    Fon transparent: Figma'da pill rangi (#74301c) bar rangi bilan
                    aynan bir xil, ya'ni pill ko'rinmaydi — u faqat o'lcham va
                    bosish maydonini beradi. */}
                <Link
                  ref={katalogRef}
                  href="/catalog"
                  className={`group flex h-10 items-center gap-4 bg-transparent px-[15px] text-[14px] transition-colors duration-300 ease-out xl:col-start-2 xl:col-span-3 xl:justify-self-start ${
                    variant === "light"
                      ? "hover:opacity-60"
                      : "hover:text-[#E0CAAB]"
                  }`}
                  data-node-id="100:461"
                >
                  <span className="elx-katalog-text whitespace-nowrap">
                    Каталог ковров
                  </span>
                  <AnimatedTwoLineBurger />
                </Link>
              </div>

              {/* ─── O'NG: linklar + 3 ikonka ───
                  col-start-7 aniq berilgan: xl+ da chap tomon grid item'larga
                  ajralganda auto-placement bu blokni c6 ga surib yubormasligi
                  uchun. justify-self-end → grid'ning o'ng chetiga tekis. */}
              <div
                ref={rightRef}
                className="col-start-7 col-span-6 flex items-center justify-self-end gap-4 lg:gap-5"
              >
                {/* Figma Group 98 (199:2501) — ikki pill YONMA-YON, oraliq 0.
                    Ko'rinadigan 30px masofa ikkala pill'ning 15px padding'idan
                    hosil bo'ladi, gap'dan emas. */}
                <div className="elx-pills flex items-center">
                  {/* Pill — Figma 199:2496: h 40px, px 15px → 15 + 140 + 15 = 170px. */}
                  <Link
                    href="#call-specialist"
                    className="elx-call inline-flex h-10 items-center whitespace-nowrap bg-transparent px-[15px] text-[14px] opacity-40 transition-opacity duration-150 hover:opacity-100"
                    data-node-id="100:452"
                  >
                    Вызвать специалиста
                  </Link>
                  {/* Pill — Figma 199:2494: h 40px, px 15px → 15 + 90 + 15 = 120px. */}
                  <Link
                    href="#ar"
                    className="elx-ar inline-flex h-10 items-center whitespace-nowrap bg-transparent px-[15px] text-[14px] opacity-40 transition-opacity duration-150 hover:opacity-100"
                    data-node-id="100:453"
                  >
                    AR-Примерка
                  </Link>
                </div>

                {/* Figma Group 97 (199:2500) — 3 ikonka, oraliq 30px (desktop).
                    Mobilda 16px: 30px bo'lsa 320px ekranda joy yetmaydi.
                    Sakrash `md:` emas, `lg:` da: 768px'da o'ng blok birdan 32px
                    kengayib, «Вызвать» 768-774px oralig'ida yo'qolib qayta
                    paydo bo'lardi (o'lchangan). lg'da esa zaxira yetarli. */}
                <div className="flex items-center gap-4 lg:gap-[30px]">
                  <button
                    type="button"
                    aria-label="Sevimlilar"
                    className="elx-hit transition-transform duration-150 hover:scale-110"
                  >
                    <Heart size={22} strokeWidth={1.25} />
                  </button>
                  <Link
                    href="/account"
                    aria-label="Profil"
                    className="elx-hit transition-transform duration-150 hover:scale-110"
                  >
                    <UserCircle2 size={22} strokeWidth={1.25} />
                  </Link>
                  <Link
                    href="/cart"
                    aria-label="Savatcha"
                    className="elx-hit relative transition-transform duration-150 hover:scale-110"
                  >
                    <span
                      key={bumpKey}
                      className={`inline-flex ${bumpKey > 0 ? "elx-cart-bump" : ""}`}
                    >
                      <ShoppingCart size={22} strokeWidth={1.25} />
                      {mounted && cartCount > 0 && (
                        <span className="absolute -right-[7px] -top-[7px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-white px-[3px] text-[10px] font-semibold leading-none text-black">
                          {cartCount}
                        </span>
                      )}
                    </span>
                  </Link>
                </div>
              </div>
            </nav>
          </Container>
        </div>
      </header>
    </>
  );
}
