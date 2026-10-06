"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";

import Container from "./container";
import CatalogQuantityPicker from "./catalog-quantity-picker";
import CatalogSizePicker from "./catalog-size-picker";
import CatalogCollectionContent from "./catalog-collection-content";
import {
  productImageTransitionName,
  type CatalogCollection,
  type CatalogProductVariant,
} from "@/data/catalog-elexus";
import { formatSumElexus } from "@/utils/format-sum-elexus";
import { useAppDispatch } from "@/lib/hooks";
import { addElexusCartItem } from "@/lib/features";

/** `product.gallery`dagi element video bo'lsa `<video>`, bo'lmasa
 * `next/image` bilan ko'rsatiladi — ikkalasi ham shu bitta ro'yxatda. */
function isVideoUrl(src: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(src);
}

/** Rang doira tugmalari ustidagi label — elexus komponentlari hozircha
    next-intl `messages/*.json` orqali emas, shunday qo'lda tarjima qilinadi
    (qolgan matn ham shu uslubda, qarang "Цена"/"Добавить в корзину"). */
const COLOR_LABEL: Record<string, string> = { ru: "Цвета", en: "Colors", uz: "Ranglar" };

/*
 * Elexus — Mahsulot (bitta model) sahifasi kontenti. Figma frame 100:803
 * (2026-09-30'da qayta tekshirilgan — node ID'lar bo'yicha).
 * Header/Toolbar/Footer'siz — faqat kontent (catalog-collection-content.tsx
 * bilan bir xil naqsh: /catalog/[collection]/[model] alohida sahifa VA
 * /catalog'da "shu joyning o'zida" ochilganda ikkalasida ham shu komponent).
 * ─────────────────────────────────────────────────────────────────────────
 * FIGMA O'LCHAMLARI (1920 freym, kontent 1720, chekka margin 100, 12 ustun;
 * 2026-09-30'da qayta tekshirilgan — dizayn yangilangan edi):
 *   Uchta ustun BIR QATORDA, hammasi bir xil y'dan boshlanadi (sarlavha va
 *   hero rasm TEPA-TEPA, biri ikkinchisi ostida emas):
 *     Ustun 1-2  (chap)  — kolleksiya nomi (32px) + model (16px, gap-[7px],
 *                          ikkalasi ham uppercase) — node 327:2674/2676/2678;
 *                          "Цена ... за м2" (node 319:2660-2662); galereya
 *                          karuseli (node 319:2654-2658).
 *     Ustun 3-8  (markaz)— hero rasm, QAT'IY 700×900, zona ichida (zona 6
 *                          ustun ≈860px keng, rasm markazga yaqin suzadi —
 *                          chap/o'ng flush emas).
 *     Ustun 9-12 (o'ng)  — Размеры/Количество, CTA panel (90px, #74301c),
 *                          tavsif, 10 qatorli xarakteristika (x=1257,
 *                          kengligi 562).
 *   Galereya — hozircha PLACEHOLDER (backend'da hali ko'p rasm/video yo'q):
 *     `product.gallery`dan (kamida 1 element) tuziladi, bosilganda hero
 *     rasm shu joyning o'zida almashadi (View Transition'ga tegmaydi —
 *     faqat local state).
 *
 * "ДРУГИЕ МОДЕЛИ" — Figma'da bu endi mustaqil kichik to'r EMAS, balki
 * xuddi /catalog/[slug] sahifasidagi sidebar+to'r (CatalogCollectionContent)
 * — chap tarafda kolleksiya sarlavha/tavsif/spec, o'ngda 2 ustunli
 * CatalogCollectionGrid (630×814 kartalar). Shu komponent aynan shu holda
 * qayta ishlatiladi (`products: otherModels` bilan) — alohida variant
 * yasalmadi (kelishuv: mavjud CatalogProductTile/Grid saqlanadi).
 *
 * RANG: label #C9C5BF (uppercase) · qiymat #7E7C78 · CTA matn oq ·
 * sarlavha/CTA fon #74301c — barchasi saytda allaqachon o'rnatilgan tizim.
 * Xarakteristika jadvali border rangi — Figma'dan aniq: #dcd8d2 (oxirgi
 * qator — "Доставка" — border'siz, Figma'da ham shunday).
 *
 * `embedded` — /catalog accordion'ida (catalog-collection-row.tsx) bitta
 * mahsulot ochilganda shu komponent ICHKI holatda (o'z Container'isiz,
 * "Другие модели"siz, CHAP ustunsiz) qo'llanadi — ota qator o'zi allaqachon
 * Container, qolgan modellar to'rini VA chap kontekst (`CatalogProductContext`,
 * pastda) blokini o'zining chinakam qator-chetidagi sticky ustunida beradi
 * (sticky baton-pass: scroll'da avval mahsulot konteksti, keyin kolleksiya
 * konteksti sticky bo'lib almashishi uchun — ikkalasi bitta ustunda bo'lsa
 * bu effekt ishlamas edi). Shu sabab `embedded`da `activeImage` TASHQARIDAN
 * (qator state'idan) keladi — galereya tugmalari endi shu komponent ICHIDA
 * emas, balki `CatalogProductContext`da (qatorning chap ustunida) chiqadi.
 * Standalone `/catalog/[collection]/[model]` sahifada (SEO/to'g'ridan-to'g'ri
 * link) esa `embedded` yo'q — to'liq holat, o'z ichida `CatalogProductContext`
 * va `activeImage` state'ini o'zi boshqaradi.
 */

/** Sarlavha, narx, galereya — standalone sahifada o'z ustunida, accordion
 * ichida esa qatorning chinakam chap ustunida (sticky) ishlatiladi. */
export function CatalogProductContext({
  collection,
  product,
  activeImage,
  onSelectImage,
}: {
  collection: CatalogCollection;
  product: CatalogProductVariant;
  activeImage: string;
  onSelectImage: (src: string) => void;
}) {
  const locale = useLocale();
  return (
    <>
      <div className="flex flex-col gap-[7px] uppercase text-black">
        <p className="text-[32px] font-medium leading-[1.5] tracking-[-0.352px]">
          {product.modelTitle}
        </p>
        <p className="text-[16px] font-semibold leading-normal">{collection.title}</p>
      </div>

      <div className="mt-[20px] flex flex-col gap-[4px] text-[14px] text-[#7E7C78]">
        <p className="uppercase opacity-50">Цена</p>
        <p>{formatSumElexus(collection.price)} сум</p>
      </div>

      {product.gallery.length > 1 && (
        <div className="mt-[30px] flex items-center gap-[16px]">
          {product.gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onSelectImage(src)}
              aria-pressed={src === activeImage}
              className={`relative h-[40px] shrink-0 overflow-hidden transition-opacity duration-150 ${
                i === 0 ? "w-[29px]" : "w-[64px]"
              } ${src === activeImage ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
            >
              {isVideoUrl(src) ? (
                <video src={src} muted loop playsInline className="h-full w-full object-cover" />
              ) : (
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Rang variantlari — doira tugmalar, bosilganda hero/galereya shu
          rangning default rasmiga almashadi (onSelectImage'ning o'zi). */}
      {product.colors && product.colors.length > 0 && (
        <div className="mt-[20px] flex flex-col gap-[8px]">
          <p className="text-[14px] uppercase text-[#7E7C78] opacity-50">
            {COLOR_LABEL[locale] ?? COLOR_LABEL.ru}
          </p>
          <div className="flex flex-wrap items-center gap-[10px]">
            {product.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectImage(c.image)}
                aria-pressed={c.image === activeImage}
                title={c.title}
                className={`relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full border transition-all duration-150 ${
                  c.image === activeImage
                    ? "border-black"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={c.image} alt={c.title} fill sizes="36px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function CatalogProductDetail({
  collection,
  product,
  onOpenProduct,
  embedded = false,
  activeImage: embeddedActiveImage,
}: {
  collection: CatalogCollection;
  product: CatalogProductVariant;
  /** Boshqa model kartasi bosilganda (pastdagi "Другие модели"'da). */
  onOpenProduct?: (product: CatalogProductVariant) => void;
  /** /catalog accordion ichida — qarang: yuqoridagi izoh. */
  embedded?: boolean;
  /** Faqat `embedded`da — ota qator boshqaradigan galereya holati. */
  activeImage?: string;
}) {
  const otherModels = collection.products.filter((p) => p.id !== product.id);
  const [internalActiveImage, setInternalActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(collection.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInternalActiveImage(product.image);
    // Boshqa model tanlanganda (embedded "Другие модели"dan) tanlov
    // o'sha modelning o'z sukut holatiga qaytadi.
    setSelectedSize(collection.sizes[0]);
    setQuantity(1);
  }, [product.id, product.image, collection.sizes]);

  const activeImage = embedded ? embeddedActiveImage ?? product.image : internalActiveImage;

  function handleAddToCart() {
    dispatch(
      addElexusCartItem({
        collectionSlug: collection.slug,
        productId: product.id,
        size: selectedSize,
        pricePerUnit: collection.price,
        maxQuantity: collection.maxQuantity,
        quantity,
      }),
    );
  }

  const hero = (
    <div
      className="relative aspect-[700/900] w-full max-w-[700px] overflow-hidden"
      style={{ viewTransitionName: productImageTransitionName(product.id) }}
    >
      {isVideoUrl(activeImage) ? (
        <video
          src={activeImage}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={activeImage}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 36vw, 100vw"
          className="object-cover"
          priority
        />
      )}
    </div>
  );

  // Forma (Rulo/Oval/...) — MODEL+shape darajasiga tegishli (kolleksiya
  // emas), shuning uchun `collection.detailSpecs`da yo'q — shu yerda ro'yxat
  // BOSHIGA qo'shiladi (product.shapeTitle, catalog-adapter.ts).
  const allDetailSpecs = product.shapeTitle
    ? [{ label: "Форма", value: product.shapeTitle }, ...collection.detailSpecs]
    : collection.detailSpecs;

  const specs = (
    <div className="max-w-[562px]">
      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-4">
        <CatalogSizePicker sizes={collection.sizes} value={selectedSize} onChange={setSelectedSize} />
        <CatalogQuantityPicker max={collection.maxQuantity} value={quantity} onChange={setQuantity} />
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-[26px] flex h-[90px] w-full items-center justify-between bg-[color:var(--elx-bg,#74301c)] px-[33px] text-white transition-opacity duration-150 hover:opacity-80"
        style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
      >
        <span className="text-[16px] font-semibold uppercase">Добавить в корзину</span>
        <span className="text-[16px] font-semibold">{formatSumElexus(collection.price)} сум</span>
      </button>

      <div className="mt-[30px] flex flex-col gap-[9px] text-[14px] leading-[1.5] text-[#7E7C78]">
        <p>{collection.description[0]}</p>
        <p>{collection.description[1]}</p>
      </div>

      <dl className="mt-[30px]">
        {allDetailSpecs.map((s, i) => (
          <div
            key={s.label}
            className={`grid grid-cols-[197px_1fr] py-[16px] text-[14px] ${
              i < allDetailSpecs.length - 1 ? "border-b border-[#dcd8d2]" : ""
            }`}
          >
            <dt className="text-[#7E7C78]">{s.label}</dt>
            <dd className="text-black">
              {Array.isArray(s.value) ? (
                <span className="flex flex-col">
                  {s.value.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              ) : (
                s.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );

  if (embedded) {
    // Ota qatorning (catalog-collection-row.tsx) TO'G'RIDAN-TO'G'RI
    // grid-cols-12 farzandlari sifatida — chinakam sahifa ustunlari (col 3-7
    // rasm, col 8-12 xarakteristika) ishlatilishi uchun, ichki joylashgan
    // mustaqil grid EMAS (aks holda kontekst ustuni (col 1-2) bergan joyni
    // qaytarib bermaydi — rasm/xarakteristika siqilib qoladi).
    //
    // `lg:self-start` — FAQAT rasm bloki uchun: ota grid'ning align-items
    // DEFAULT holati (stretch) ataylab qoldirilgan, chunki kontekst ustuni
    // (chapda, catalog-collection-row.tsx'da) sticky bo'lib shu qator
    // balandligi (eng baland — xarakteristika) bo'ylab yopishib turishi
    // uchun o'ZINING grid-katagi SHU balandlikka cho'zilishi SHART. Agar
    // rasm bloki ham cho'zilsa — 700×900 aspect-ratio buziladi (rasm
    // vertikal cho'zilib ketadi), shuning uchun faqat shu bittasiga
    // `self-start` bilan stretch'dan chiqarilgan.
    return (
      <>
        <div className="col-span-12 mt-10 flex justify-center lg:col-span-5 lg:col-start-3 lg:mt-0 lg:self-start">
          {hero}
        </div>
        <div className="col-span-12 mt-10 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:pl-[20px]">
          {specs}
        </div>
      </>
    );
  }

  const content = (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-[14px]">
      {/* ─── Chap ustun — sarlavha, narx, galereya (Figma col 1-2) ─── */}
      <div className="lg:col-span-2 lg:col-start-1">
        <CatalogProductContext
          collection={collection}
          product={product}
          activeImage={activeImage}
          onSelectImage={setInternalActiveImage}
        />
      </div>

      {/* ─── Markaziy ustun — hero rasm (Figma col 3-8, 700×900) ─── */}
      <div className="flex justify-center lg:col-span-6 lg:col-start-3">{hero}</div>

      {/* ─── O'ng ustun — xarakteristika (Figma col 9-12) ─── */}
      <div className="lg:col-span-4 lg:col-start-9">{specs}</div>
    </div>
  );

  return (
    <div>
      {/* CatalogCollectionContent o'zining pb-[87px]'iga ega — ikkalasi
          birga qo'llansa bo'sh joy ikki barobar bo'lib qolardi. */}
      <Container className={otherModels.length > 0 ? undefined : "pb-[87px]"}>
        {content}
      </Container>

      {otherModels.length > 0 && (
        <div className="mt-[100px]">
          <CatalogCollectionContent
            collection={{ ...collection, products: otherModels }}
            onOpenProduct={onOpenProduct}
          />
        </div>
      )}
    </div>
  );
}
