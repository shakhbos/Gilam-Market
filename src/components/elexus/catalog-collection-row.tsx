"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import Container from "./container";
import CatalogProductTile from "./catalog-product-tile";
import CatalogCollectionSidebar from "./catalog-collection-sidebar";
import CatalogProductDetail, { CatalogProductContext } from "./catalog-product-detail";
import { Link } from "@/i18n/routing";
import type { CatalogCollection, CatalogProductVariant } from "@/data/catalog-elexus";

/*
 * Elexus — /catalog sahifasidagi BITTA kolleksiya qatori — "Single-Page
 * Dynamic Accordion" (2026-10-01, user bilan kelishilgan UX mantiq).
 * ─────────────────────────────────────────────────────────────────────────
 * 2 holat:
 *   YOPIQ   — chapda sarlavha/tavsif/spec/"Посмотреть все" (col1-3), o'ngda
 *              2 ta tasodifiy mahsulot rasmi (col4-12) — avvalgi
 *              catalog-product-row.tsx bilan bir xil ko'rinish.
 *   OCHIQ   — IKKITA mustaqil sticky-qator ustma-ust (pastda tushuntirilgan
 *              sabab bilan BITTA emas):
 *       1) agar `activeProductId` bor bo'lsa — chapda STICKY
 *          `CatalogProductContext` (sarlavha/narx/galereya), o'ngda
 *          `CatalogProductDetail embedded` (hero rasm + xarakteristika).
 *       2) HAR DOIM (model ochiq/ochiq emas) — chapda STICKY
 *          `CatalogCollectionSidebar` + "Скрыть", o'ngda qolgan modellar
 *          2 ustunli to'rda.
 *
 * NEGA IKKITA ALOHIDA GRID QATOR (bitta emas) — "sticky baton-pass" effekti
 * uchun: CSS `position: sticky` elementi faqat O'Z QATORI balandligi
 * doirasida yopishqoq bo'ladi. Agar mahsulot konteksti VA kolleksiya
 * konteksti BITTA umumiy baland qatorda bo'lsa, faqat BITTASI (birinchi
 * render qilingani) butun balandlik davomida yopishib qoladi — aynan shu
 * bug avvalgi versiyada bor edi (kolleksiya sidebar'i mahsulot ochilganda
 * ham joyidan siljimas edi). Ikkita qatorga bo'lib, har birini o'z sticky
 * egasi bilan alohida render qilish orqali: scroll'da avval 1-qatorning
 * sticky konteksti (mahsulot) ko'rinadi, 1-qator balandligi tugagach tabiiy
 * ravishda 2-qatorning sticky konteksti (kolleksiya) uning o'rnini egallaydi
 * — qo'shimcha JS/IntersectionObserver kerak emas, sof CSS.
 *
 * `activeImage` (galereya) — endi SHU komponentda yashaydi (ota chap
 * ustunidagi `CatalogProductContext` VA o'ng ustundagi
 * `CatalogProductDetail`ning hero rasmi ikkalasi ham shu bitta state'ga
 * bog'liq, chunki ular endi ikki alohida komponent/joyda).
 *
 * ORQAGA QAYTISH STRELKASI YO'Q (ataylab, 2026-10-01 user so'rovi bilan
 * olib tashlandi): kolleksiyani yopish — xuddi ochish kabi — bitta "Скрыть"
 * tugmasi orqali (`onToggle`, "Посмотреть все"ning aylanma holati). Ochiq
 * mahsulotni alohida yopish tugmasi YO'Q — boshqa model bosilsa almashadi,
 * butun kolleksiya "Скрыть" bilan yopilsa u ham birga yopiladi.
 *
 * Bir vaqtda faqat 1 ta qator ochiq bo'lishi — bu komponent BILMAYDI, buni
 * ota (`catalog-listing.tsx`) `isActive`/`activeProductId` propsi orqali
 * nazorat qiladi (single source of truth yuqorida).
 *
 * `<motion.div layout>` — bu qator cho'zilganda/qisqarganda PASTDAGI
 * boshqa qatorlar avtomatik silliq suriladi (framer/motion'ning shared
 * layout animatsiyasi — alohida kod yozmasdan).
 *
 * AUTO-SCROLL TO TOP — `isActive` YOKI `activeProductId` o'zgarganda (useEffect,
 * qarang pastda) sahifa shu qatorning tepasiga silliq ko'tariladi (`scroll-mt`
 * — sticky header+toolbar balandligini hisobga oladi). 2026-10-01'da
 * `onLayoutAnimationComplete`DAN bu useEffect'ga o'tkazildi — SABAB: ochiq
 * turgan qatorda (collection allaqachon active) BOSHQA modelni tanlasa,
 * qatorning UMUMIY balandligi deyarli o'zgarmaydi (Row A allaqachon bor edi,
 * faqat ICHIDAGI mahsulot almashadi) — demak framer-motion HECH QANDAY
 * sezilarli layout animatsiyasini ishga tushirmaydi, shuning uchun
 * `onLayoutAnimationComplete` CHAQIRILMAYDI ham — natijada scroll ishlamay
 * qolardi (user pastda, to'rda qolib ketardi, yangi ochilgan mahsulotni
 * KO'RMASDAN). `useEffect([isActive, activeProductId])` esa bu holatdan
 * QAT'IY NAZAR (layout animatsiyasi bo'ladimi yo'qmi) har doim ishga
 * tushadi — React render tugagach DOM geometriyasi allaqachon YAKUNIY
 * (framer-motion FLIP texnikasi: DOM joylashuvi SINXRON yakuniy, faqat
 * VIZUAL transform animatsiya qilinadi), shuning uchun `scrollIntoView`
 * darhol to'g'ri nishonga silliq scroll qiladi — framer-motion'ning o'z
 * vizual animatsiyasi bilan PARALLEL, bir-biriga xalaqit bermaydi.
 * Birinchi render'da ISHGA TUSHMAYDI (`isFirstRender` ref) — sahifa
 * to'g'ridan-to'g'ri ochiq holatda yuklansa (masalan to'g'ridan-to'g'ri link)
 * kutilmagan scroll sakrashi bo'lmasligi uchun.
 *
 * REORDER PAYTIDAGI "POP" (ma'lum, ataylab qoldirilgan) — qator DOM
 * tartibida 1-o'ringa ko'chganda (`catalog-listing.tsx`dagi `orderedCollections`,
 * `active.collectionSlug` asosida DARHOL) bitta martalik sakrash bor — bu
 * `scrollend`-asoslangan kechiktirilgan reorder + alohida "oniy tuzatish"
 * bilan "silliqlashtirishga" urinilgan edi (2026-10-01), lekin natija
 * KO'PROQ chalkash chiqdi (bir nechta scroll hodisasi ketma-ket, user "tez-
 * tez kadr almashinuvi, asabiylashtiradi" deb baholadi) — shu sabab BEKOR
 * QILINDI. Hozirgi YAGONA, bashorat qilinadigan sakrash — avvalgi murakkab
 * (lekin battar) variantdan afzal.
 *
 * `<Link href="/catalog/...">` — JS o'chirilgan/crawler holat uchun ZAXIRA
 * (haqiqiy navigatsiya qiladi); oddiy klikda `onClick` preventDefault qilib
 * accordion holatini almashtiradi — SEO uchun link grafigi saqlanadi,
 * standalone sahifalar esa link nishonlari sifatida qoladi (catalog-listing.tsx
 * shu bilan birga URL'ni ham pushState orqali sinxronlaydi).
 */
export default function CatalogCollectionRow({
  collection,
  previewProducts,
  isActive,
  activeProductId,
  onToggle,
  onOpenProduct,
}: {
  collection: CatalogCollection;
  /** Yopiq holatda ko'rsatiladigan (tasodifiy tanlangan) 2 model. */
  previewProducts: readonly CatalogProductVariant[];
  isActive: boolean;
  /** Shu kolleksiya ichida ochiq turgan model id'si (yo'q bo'lsa `null`). */
  activeProductId: string | null;
  onToggle: () => void;
  onOpenProduct: (product: CatalogProductVariant) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const activeProduct = activeProductId
    ? collection.products.find((p) => p.id === activeProductId)
    : undefined;
  const gridProducts = activeProduct
    ? collection.products.filter((p) => p.id !== activeProduct.id)
    : collection.products;

  // Galereya holati shu yerda yashaydi — chap ustundagi `CatalogProductContext`
  // (thumbnail tugmalari) VA o'ng ustundagi `CatalogProductDetail` (hero rasm)
  // endi ikki ALOHIDA joyda render qilinadi (sticky baton-pass uchun, qarang
  // yuqoridagi izoh), shuning uchun holat ularning umumiy ota-komponentida.
  const [activeImage, setActiveImage] = useState(activeProduct?.image ?? "");
  useEffect(() => {
    setActiveImage(activeProduct?.image ?? "");
  }, [activeProduct?.id, activeProduct?.image]);

  // Qarang yuqoridagi "AUTO-SCROLL TO TOP" izohi — nega `onLayoutAnimationComplete`
  // EMAS, aynan shu useEffect.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isActive) rowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isActive, activeProductId]);

  return (
    <motion.div layout ref={rowRef} className="scroll-mt-[170px]">
      <Container>
        {!isActive ? (
          <div className="grid grid-cols-12 gap-x-[14px]">
            {/* ─── Chap — sarlavha/tavsif/spec ─── */}
            <div className="col-span-12 flex flex-col lg:col-span-3 lg:col-start-1">
              <p className="text-[16px] font-semibold uppercase leading-[1.2] tracking-[-0.176px] text-black">
                {collection.title}
              </p>

              <div className="mt-[12px] flex flex-col gap-[1em] text-[14px] leading-[1.5] text-[#7E7C78]">
                <p>{collection.description[0]}</p>
                <p>{collection.description[1]}</p>
              </div>

              <dl className="mt-[12px] flex flex-col gap-[12px] text-[14px] leading-[normal]">
                {collection.specs.map((s) => (
                  <div key={s.label}>
                    <dt className="uppercase text-[#C9C5BF]">{s.label}</dt>
                    <dd className="mt-[4px] text-[#7E7C78]">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href={`/catalog/${collection.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onToggle();
                }}
                className="mt-[40px] block w-fit text-[14px] text-black underline-offset-4 transition-opacity duration-150 hover:opacity-60"
              >
                Посмотреть все
              </Link>
            </div>

            {/* ─── O'ng — 2 tasodifiy preview ─── */}
            <div className="col-span-12 mt-10 lg:col-span-9 lg:col-start-4 lg:mt-0">
              <div className="grid grid-cols-2 gap-x-[16px]">
                {previewProducts.map((p) => (
                  <CatalogProductTile key={p.id} product={p} collection={collection} onOpen={onOpenProduct} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ─── 1-qator (faqat model ochiq bo'lsa) — chapda STICKY mahsulot
                konteksti (col 1-2, standalone sahifadagi kabi), o'ngda hero
                (col 3-7) + xarakteristika (col 8-12) — `CatalogProductDetail`
                embedded'da shu GRID'ning TO'G'RIDAN-TO'G'RI farzandlarini
                qaytaradi (ichki joylashgan mustaqil grid EMAS), aks holda
                chinakam sahifa ustunlari ishlamay, rasm/xarakteristika
                siqilib qolardi. O'Z grid qatori — pastdagi kolleksiya
                konteksti bilan sticky balandligi aralashmasligi uchun. ─── */}
            {activeProduct && (
              <div className="grid grid-cols-12 gap-x-[14px]">
                <div className="col-span-12 flex flex-col lg:col-span-2 lg:col-start-1">
                  <div className="xl:sticky xl:top-[170px] xl:h-fit">
                    <CatalogProductContext
                      collection={collection}
                      product={activeProduct}
                      activeImage={activeImage || activeProduct.image}
                      onSelectImage={setActiveImage}
                    />
                  </div>
                </div>
                <CatalogProductDetail
                  collection={collection}
                  product={activeProduct}
                  embedded
                  activeImage={activeImage || activeProduct.image}
                />
              </div>
            )}

            {/* ─── 2-qator (har doim, model ochiq/ochiq emas) — chapda STICKY
                kolleksiya konteksti + "Скрыть", o'ngda qolgan modellar to'ri. ─── */}
            <div className={`grid grid-cols-12 gap-x-[14px] ${activeProduct ? "mt-[40px]" : ""}`}>
              <div className="col-span-12 flex flex-col lg:col-span-3 lg:col-start-1">
                <div className="xl:sticky xl:top-[170px] xl:h-fit">
                  <CatalogCollectionSidebar collection={collection} />

                  {/* `block` SHART — bu `<a>` endi flex ota (yopiq holatdagi
                      kabi) ICHIDA EMAS, oddiy `<div>` ichida, demak default
                      `inline`da qoladi; inline elementda `margin-top` UMUMAN
                      qo'llanmaydi (CSS qoidasi) — `block`siz "Скрыть" xuddi
                      "Посмотреть все" turgan joyda EMAS, 40px YUQORIDA
                      chiqib qolardi (user shuni payqagan edi). */}
                  <Link
                    href="/catalog"
                    onClick={(e) => {
                      e.preventDefault();
                      onToggle();
                    }}
                    className="mt-[40px] block w-fit text-[14px] text-black underline-offset-4 transition-opacity duration-150 hover:opacity-60"
                  >
                    Скрыть
                  </Link>
                </div>
              </div>
              <div className="col-span-12 mt-10 lg:col-span-9 lg:col-start-4 lg:mt-0">
                <div className="grid grid-cols-2 gap-x-[16px] gap-y-[21px]">
                  {gridProducts.map((p) => (
                    <CatalogProductTile key={p.id} product={p} collection={collection} onOpen={onOpenProduct} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </motion.div>
  );
}
