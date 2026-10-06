"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "motion/react";

import CatalogCollectionRow from "./catalog-collection-row";
import type { CatalogCollection, CatalogProductVariant } from "@/data/catalog-elexus";

/*
 * Elexus — /catalog sahifasining "jonli" qismi — "Single-Page Dynamic
 * Accordion" (2026-10-01, user bilan kelishilgan UX mantiq, avvalgi
 * list/collection/product 3-holatli + View Transitions yondashuvi O'RNIGA).
 * ─────────────────────────────────────────────────────────────────────────
 * BARCHA kolleksiyalar HAR DOIM render qilinadi (`CatalogCollectionRow`,
 * bittadan) — hech qaysi holat boshqasini "almashtirmaydi", faqat BITTA
 * qator o'zi cho'ziladi/qisqaradi (Figma emas, qo'lda chizilgan wireframe
 * asosida). Yagona holat manbai — shu komponentda:
 *
 *   activeCollectionSlug — qaysi BITTA qator ochiq (yo'q bo'lsa null).
 *   activeProductId      — o'sha ochiq qator ICHIDA qaysi model ochiq.
 *
 * Yangi kolleksiya ochilganda avvalgi kolleksiya HAM, undagi ochiq model
 * HAM avtomatik yopiladi — `setActive` har doim BUTUN obyektni almashtiradi
 * (merge emas), shu orqali "faqat 1 ta ochiq" qoidasi o'zi-o'zidan bajariladi.
 *
 * FAOL QATOR — RO'YXATNING BOSHIGA KO'CHADI (2026-10-01, user so'rovi bilan
 * qo'shildi): faol kolleksiya DOM tartibida BIRINCHI bo'lib render qilinadi
 * (`orderedCollections`, `active.collectionSlug` asosida, DARHOL — kechikish
 * YO'Q), shunda tepaga qo'lda scroll qilinsa boshqa hech qanday (yopiq)
 * kolleksiya qatori qolmaydi (eski bug: "faol qator sahifaning 1-qatori"
 * degan taassurotga zid edi, chunki undan OLDIN turgan qatorlar DOMda hali
 * ham bor edi).
 *
 * ESLATMA (2026-10-01, bir marta sinab ko'rilgan, BEKOR QILINGAN): reorderni
 * `scrollend`/timeout bilan KECHIKTIRISH va keyin alohida "oniy" scroll
 * tuzatish qo'shish orqali "pop" o'rniga "silliq scroll" hissi berishga
 * urinildi — lekin amalda bu YANADA CHALKASH natija berdi (ko'p marta scroll
 * event/frame almashinuvi, user "tez-tez kadr almashinuvi, asabiylashtiradi"
 * deb baholadi). SABAB ehtimol: `scrollend` boshqa (framer-motion layout
 * animatsiyalaridan kelib chiqqan) scroll hodisalariga ham reaksiya berib,
 * kutilmagan vaqtda ishga tushishi, YOKI bir nechta qator BIR VAQTDA FLIP
 * animatsiya qilayotganda qo'shimcha "oniy" scroll tuzatish o'ziga xos
 * tebranish keltirib chiqarishi mumkin. Shu sabab ODDIY, DARHOL reorder'ga
 * qaytarildi — "pop" effekti hali ham bor (reorder paytida bir martalik
 * sakrash), lekin bu YAGONA, BASHORAT QILINADIGAN sakrash — ko'p martalik
 * chalkash animatsiyadan KO'RA YAXSHIROQ UX. Agar kelajakda "pop"ni
 * yumshatish kerak bo'lsa — alohida, soddaroq yechim izlash kerak (masalan:
 * reorder paytida BUTUN RO'YXATni animatsiyasiz/`layout={false}` qilib,
 * FAQAT scrollIntoView'ning o'zi silliq ishlashiga ishonish).
 *
 * QOLGAN QATORLAR TARTIBI — AYLANMA (rotate), "teskari tartib" EMAS
 * (2026-10-01, user aniqlashtirgach tuzatildi — birinchi urinish, oldingi
 * kolleksiyalarni TESKARI tartibda faol qatordan keyin qo'yish, NOTO'G'RI
 * chiqdi). To'g'ri mantiq: faol qatordan KEYIN turgan (hali "ko'rilmagan")
 * kolleksiyalar o'z asl tartibida DARHOL ortidan keladi, faol qatordan
 * OLDIN turgan (allaqachon "ko'rilgan") kolleksiyalar esa — o'z asl
 * tartibida — RO'YXATNING ENG OXIRIGA tushadi. Masalan 10 ta kolleksiyadan
 * 1-5 ko'rib chiqilgach 6-si ochilsa: [6,7,8,9,10, 1,2,3,4,5] — xuddi
 * AYLANA (karusel) kabi, user scroll qilib borayotgan YO'NALISH davom
 * etadi (7,8,9,10), faqat ORQADA qolganlar (1-5) oxiriga "aylanib" o'tadi.
 * Implementatsiya — oddiy array rotate: `[...from(idx), ...before(idx)]`.
 * Bu ham user'ning avvalgi talabini qondiradi ("1-kolleksiya doim faol
 * qatordan keyin chiqmasligi kerak") — faqat OXIRGI (eng so'nggi) qator
 * ochilganda (undan KEYIN hech narsa yo'q) tabiiy ravishda 1-kolleksiya
 * ortidan keladi — bu aylanishning tabiiy, kutilgan natijasi.
 *
 * URL SYNC (SEO) — standalone `/catalog/[slug]` va `/catalog/[collection]/[model]`
 * sahifalar (to'g'ridan-to'g'ri link/crawler uchun) ATAYLAB tegilmagan.
 * Shu sahifada esa `window.history.pushState` bilan manzil satri o'sha
 * URL'larga "soxta" almashadi — Next router orqali EMAS (aks holda haqiqiy
 * navigatsiya bo'lib, butun sahifa qayta yuklanardi va accordion holati
 * yo'qolardi). Foydalanuvchi shu manzilni ulashsa/yangilasa — Next haqiqiy
 * standalone sahifani (to'liq SSR, indekslanadigan) beradi; shu sahifaning
 * o'zida esa faqat manzil satri o'zgaradi, DOM saqlanib qoladi. Orqaga/oldinga
 * tugmalari — `popstate` orqali qo'lda sinxronlanadi (Next router bu
 * pushState'larni "ko'rmaydi").
 */

type Active = { collectionSlug: string | null; productId: string | null };

const CLOSED: Active = { collectionSlug: null, productId: null };

export default function CatalogListing({
  collections,
}: {
  /** Server'da bir marta tanlangan (tasodifiy) 2 model — har kolleksiya uchun. */
  collections: readonly {
    collection: CatalogCollection;
    preview: readonly CatalogProductVariant[];
  }[];
}) {
  const locale = useLocale();
  const [active, setActive] = useState<Active>(CLOSED);

  const buildPath = useCallback(
    (collectionSlug: string | null, modelSlug?: string | null) => {
      if (!collectionSlug) return `/${locale}/catalog`;
      return modelSlug
        ? `/${locale}/catalog/${collectionSlug}/${modelSlug}`
        : `/${locale}/catalog/${collectionSlug}`;
    },
    [locale],
  );

  // Orqaga/oldinga tugmasi — bizning pushState'larimiz Next router'ga
  // ko'rinmas, shuning uchun brauzerning o'z `popstate`'ini tinglaymiz.
  useEffect(() => {
    const onPopState = () => {
      const m = window.location.pathname.match(/\/catalog\/([^/]+)(?:\/([^/]+))?\/?$/);
      if (!m) {
        setActive(CLOSED);
        return;
      }
      const [, collectionSlug, modelSlug] = m;
      const found = collections.find((c) => c.collection.slug === collectionSlug);
      if (!found) {
        setActive(CLOSED);
        return;
      }
      const product = modelSlug
        ? found.collection.products.find(
            (p) => p.slug.toLowerCase() === modelSlug.toLowerCase(),
          )
        : undefined;
      setActive({ collectionSlug, productId: product?.id ?? null });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [collections]);

  const openCollection = (slug: string) => {
    setActive({ collectionSlug: slug, productId: null });
    window.history.pushState(null, "", buildPath(slug));
  };

  const closeCollection = () => {
    setActive(CLOSED);
    window.history.pushState(null, "", buildPath(null));
  };

  const openProduct = (collectionSlug: string, product: CatalogProductVariant) => {
    setActive({ collectionSlug, productId: product.id });
    window.history.pushState(null, "", buildPath(collectionSlug, product.slug));
  };

  const orderedCollections = (() => {
    const slug = active.collectionSlug;
    if (!slug) return collections;
    const idx = collections.findIndex((c) => c.collection.slug === slug);
    if (idx === -1) return collections;
    return [...collections.slice(idx), ...collections.slice(0, idx)];
  })();

  return (
    <motion.div layout className="flex flex-col gap-[100px] pb-[87px]">
      {orderedCollections.map(({ collection, preview }) => (
        <CatalogCollectionRow
          key={collection.id}
          collection={collection}
          previewProducts={preview}
          isActive={active.collectionSlug === collection.slug}
          activeProductId={active.collectionSlug === collection.slug ? active.productId : null}
          onToggle={() =>
            active.collectionSlug === collection.slug
              ? closeCollection()
              : openCollection(collection.slug)
          }
          onOpenProduct={(p) => openProduct(collection.slug, p)}
        />
      ))}
    </motion.div>
  );
}
