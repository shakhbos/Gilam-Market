/*
 * Elexus — Catalog demo ma'lumotlari (kolleksiya + mahsulot modellari).
 * ─────────────────────────────────────────────────────────────────────────
 * HAQIQIY BACKEND SXEMASI (grm_v2_db, jadval `model`): model — collection'dan
 * MUSTAQIL nomlangan mavjudot (`id`, `title`, `collectionId` FK), o'lcham
 * bilan hech qanday aloqasi yo'q (o'lcham alohida `size`/`qrbase` orqali
 * keladi). Haqiqiy misollar (production DB'dan so'ralgan):
 *   collection "A Bella"     → model "23551A", "25348A", "27274A", ...
 *   collection "A Delux 1200"→ model "Afshar aria", "Yalda", "Linda", ...
 * Ya'ni model nomi — alohida kod YOKI so'z, HECH QACHON o'lcham emas.
 *
 * Shu sababli bu yerda ham `modelTitle` shu uslubda (alifbo-raqamli kod) —
 * OLDIN xato ravishda o'lcham ("200×300") qo'yilgan edi, endi tuzatildi.
 *
 * Bu ikki joyda ishlatiladi:
 *   1. Catalog ro'yxati (/catalog) — har qatorda kolleksiyaning O'ZI
 *      (sarlavha/tavsif/spec) bir marta, undan tasodifiy tanlangan 2 ta
 *      MODEL rasm sifatida (har biri o'z kartasida FAQAT o'z modelTitle'i).
 *   2. Kolleksiya sahifasi (/catalog/[slug]) — o'sha kolleksiyaning
 *      BARCHA modellari, 2 ustunli to'r, cheksiz scroll.
 *
 * Demo: haqiqiy rasm fondi cheklangan (har kolleksiya uchun 2 tadan rasm
 * bor — product-*.png va discount-*.png). Ro'yxat qatorida faqat 2 tasi
 * ko'rinadi, shuning uchun har kolleksiyada 3 ta model (2 rasm navbat
 * bilan) — "Посмотреть все" bosilganda kamida 1 ta YANGI (qatorda
 * ko'rinmagan) model paydo bo'lishini ko'rsatish uchun. `pickRandomProducts`
 * umumiy — real API ko'proq model qaytarsa ham ishlayveradi.
 */

export type CatalogSpec = { label: string; value: string };

/** `value` bir necha qatorli bo'lishi mumkin (masalan "Размеры" — har o'lcham o'z qatorida). */
export type CatalogDetailSpec = { label: string; value: string | readonly string[] };

export type CatalogProductVariant = {
  id: string;
  /** /catalog/[collection]/[slug] uchun — kolleksiya ichida noyob. */
  slug: string;
  /** "n°0001" ko'rinishidagi SKU — butun katalogda noyob. */
  sku: string;
  /** To'liq tavsiflovchi nom (rasm `alt`i uchun) — "{Kolleksiya} · {model}". */
  name: string;
  /**
   * Kartada ko'rsatiladigan qisqa nom — MODEL'ning o'z nomi (backend
   * `model.title`, alifbo-raqamli kod yoki so'z — o'lcham EMAS).
   * Kolleksiya nomi ham EMAS — u sahifada/sidebar'da bitta marta (fixed)
   * ko'rsatiladi, kartada takrorlanmaydi.
   */
  modelTitle: string;
  /** Shakl (Rulo/Oval/...) — bor bo'lsa mahsulot sahifasidagi xarakteristika
   * ro'yxatining ENG BOSHIDA ko'rsatiladi (catalog-product-detail.tsx). */
  shapeTitle?: string;
  image: string;
  /**
   * Mahsulot sahifasidagi rasm/video galereyasi/karuseli (Figma 100:803,
   * node 319:2654). Element video bo'lsa URL `.mp4`/`.webm`/`.mov` bilan
   * tugaydi (`isVideoUrl()`, catalog-product-detail.tsx) — alohida maydon
   * emas, shu bitta ro'yxatda ARALASH keladi. Har doim kamida 1 ta element
   * (`image`ning o'zi).
   */
  gallery: readonly string[];
  /** Guruhdagi rang variantlari (doira tugmalar) — faqat mahsulot sahifasida
   * (group-detail'dan) to'ldiriladi, ro'yxat sahifasida yo'q. */
  colors?: readonly { id: string; title: string; image: string }[];
};

export type CatalogCollection = {
  id: string;
  /** /catalog/[slug] uchun. */
  slug: string;
  title: string;
  description: readonly [string, string];
  specs: readonly CatalogSpec[];
  /** Mahsulot sahifasidagi to'liq xarakteristika ro'yxati (Figma 100:803). */
  detailSpecs: readonly CatalogDetailSpec[];
  /** So'mda, mahsulot sahifasidagi "Добавить в корзину" panelidagi narx. */
  price: number;
  /** Mahsulot sahifasi chap ustunidagi "Цена" qatori (Figma: "от 800 000 сум за м2"). */
  pricePerSqmFrom: string;
  /**
   * "Размеры" tanlagichi (CatalogSizePicker, mahsulot sahifasi CTA panel
   * yonida) uchun — backend'dan shu kolleksiya/model uchun MAVJUD
   * o'lchamlar ro'yxati sifatida keladi. `specs`/`detailSpecs`dagi
   * "Размеры" qatoridan ATAYLAB ALOHIDA (u yerda m² bilan birga, matn
   * ko'rinishida, faqat o'qish uchun) — bu esa HAR BIRI alohida
   * bosiladigan tugma.
   */
  sizes: readonly string[];
  /** "Количество" tanlagichi (CatalogQuantityPicker) uchun — backend'dan
   * shu mahsulot uchun ruxsat etilgan maksimal miqdor (1..maxQuantity). */
  maxQuantity: number;
  products: readonly CatalogProductVariant[];
};

/** Hozircha barcha kolleksiyalarda bitta xil tavsif/spec (Figma'da ham shunday edi). */
const DESCRIPTION: readonly [string, string] = [
  "Медальон «Махи» с рыбьим орнаментом по полю. Два мастера ткут такой ковёр около 14 месяцев.",
  "Шёлковый контур держит линию: рисунок не расплывается и через сорок лет службы.",
];

const SPECS: readonly CatalogSpec[] = [
  { label: "Плотность", value: "1 000 000 узлов/м²" },
  { label: "Материал", value: "Шерсть корк и шёлк" },
  { label: "Размеры", value: "200×300 · 250×350 · 300×400" },
  { label: "Цена", value: "от 88 800 000 сум" },
];

/**
 * Mahsulot sahifasidagi to'liq xarakteristika ro'yxati — Figma 100:803
 * (Group 76-85) dan aynan olingan matn, hozircha barcha kolleksiyalarda
 * bitta xil (Figma'da ham shunday — faqat bitta variant bor edi).
 */
const DETAIL_SPECS: readonly CatalogDetailSpec[] = [
  { label: "Происхождение", value: "Иран, Тебриз" },
  { label: "Материал", value: "Шерсть корк и шёлк" },
  { label: "Плотность", value: "1 000 000 узлов/м²" },
  { label: "Тип узла", value: "Двойной персидский узел" },
  { label: "Высота ворса", value: "12 мм" },
  { label: "Стиль интерьера", value: "Классика, Восточный, Неоклассика" },
  {
    label: "Уход",
    value:
      "Пылесос без турбощётки, поворот на 180° раз в полгода. Профессиональная чистка для клиентов Elexus — бесплатно, раз в год.",
  },
  {
    label: "Примерка дома",
    value: "Привезём до четырёх ковров и оставим на выходные",
  },
  {
    label: "Доставка",
    value:
      "Ташкент — на следующий день, бесплатно от 3 000 000 сум. Самарканд и области — 2—3 дня. Подъём и укладка включены.",
  },
];

/** Barcha kolleksiyalarda bitta xil demo narx (Figma: 1 910 000 сум). */
const PRICE = 1_910_000;

/** Barcha kolleksiyalarda bitta xil demo qiymat (Figma: "от 800 000 сум за м2"). */
const PRICE_PER_SQM_FROM = "от 800 000 сум за м2";

/** `CatalogSizePicker` uchun demo o'lchamlar — `SPECS`dagi "Размеры" bilan
 * bir xil 3 ta o'lcham, lekin m²siz, alohida tugma sifatida. `DETAIL_SPECS`da
 * ENDI "Размеры" qatori YO'Q (2026-10-04 olib tashlandi) — bu picker allaqachon
 * mahsulot sahifasida ko'rsatilgani uchun pastdagi jadvalda takrorlanmasin. */
const SIZES: readonly string[] = ["200×300", "250×350", "300×400"];

/** `CatalogQuantityPicker` uchun demo maksimal miqdor (Figma demo: 1-3 шт). */
const MAX_QUANTITY = 3;

/**
 * Har kolleksiyaning 3 modeli — HAQIQIY `model.title` uslubida (production
 * DB namunasi: "23551A", "18619" kabi alifbo-raqamli kodlar), 2 rasm
 * navbat bilan (3-chisi 1-rasmni qaytaradi — haqiqiy fond shuncha).
 */
function threeModels(
  idPrefix: string,
  title: string,
  skuStart: number,
  modelCodes: readonly [string, string, string],
  imgA: string,
  imgB: string,
): readonly CatalogProductVariant[] {
  const images = [imgA, imgB, imgA];
  return modelCodes.map((code, i) => ({
    id: `${idPrefix}-${i + 1}`,
    slug: code.toLowerCase(),
    sku: `n°${String(skuStart + i).padStart(4, "0")}`,
    name: `${title} · ${code}`,
    modelTitle: code,
    image: images[i],
    gallery: Array.from(new Set([images[i], imgA, imgB])),
  }));
}

export const CATALOG_COLLECTIONS: readonly CatalogCollection[] = [
  {
    id: "tabriz-m472",
    slug: "tabriz-m472",
    title: "Тебриз 60 радж",
    description: DESCRIPTION,
    specs: SPECS,
    detailSpecs: DETAIL_SPECS,
    price: PRICE,
    pricePerSqmFrom: PRICE_PER_SQM_FROM,
    sizes: SIZES,
    maxQuantity: MAX_QUANTITY,
    products: threeModels(
      "tabriz-m472",
      "Тебриз 60 радж",
      1,
      ["M472", "M508", "M619"],
      "/elexus/product-tabriz-m472.png",
      "/elexus/discount-tabriz-m472.png",
    ),
  },
  {
    id: "aspendos-a378",
    slug: "aspendos-a378",
    title: "Aspendos A378",
    description: DESCRIPTION,
    specs: SPECS,
    detailSpecs: DETAIL_SPECS,
    price: PRICE,
    pricePerSqmFrom: PRICE_PER_SQM_FROM,
    sizes: SIZES,
    maxQuantity: MAX_QUANTITY,
    products: threeModels(
      "aspendos-a378",
      "Aspendos A378",
      4,
      ["A378", "A415", "A460"],
      "/elexus/product-aspendos-a378.png",
      "/elexus/discount-aspendos-a378.png",
    ),
  },
  {
    id: "hera-h43",
    slug: "hera-h43",
    title: "Hera H43",
    description: DESCRIPTION,
    specs: SPECS,
    detailSpecs: DETAIL_SPECS,
    price: PRICE,
    pricePerSqmFrom: PRICE_PER_SQM_FROM,
    sizes: SIZES,
    maxQuantity: MAX_QUANTITY,
    products: threeModels(
      "hera-h43",
      "Hera H43",
      7,
      ["H43", "H97", "H152"],
      "/elexus/product-hera-h43.png",
      "/elexus/discount-hera-h43.png",
    ),
  },
  {
    id: "anatoly-brenda07",
    slug: "anatoly-brenda07",
    title: "Anatoly Brenda07",
    description: DESCRIPTION,
    specs: SPECS,
    detailSpecs: DETAIL_SPECS,
    price: PRICE,
    pricePerSqmFrom: PRICE_PER_SQM_FROM,
    sizes: SIZES,
    maxQuantity: MAX_QUANTITY,
    products: threeModels(
      "anatoly-brenda07",
      "Anatoly Brenda07",
      10,
      ["Brenda07", "Brenda12", "Brenda19"],
      "/elexus/product-anatoly-brenda07.png",
      "/elexus/discount-anatoly-brenda07.png",
    ),
  },
];

export function getCatalogCollection(
  slug: string,
): CatalogCollection | undefined {
  return CATALOG_COLLECTIONS.find((c) => c.slug === slug);
}

/** `product.slug` bo'yicha (harf katta-kichikligiga qaramay) mahsulotni topadi. */
export function getCatalogProduct(
  collection: CatalogCollection,
  modelSlug: string,
): CatalogProductVariant | undefined {
  return collection.products.find(
    (p) => p.slug.toLowerCase() === modelSlug.toLowerCase(),
  );
}

/**
 * CSS `view-transition-name` — mahsulot rasmini bosganda o'sha SURAT bir
 * xil "nom" bilan ikki holatda ham (karta va mahsulot sahifasi hero'si)
 * belgilanadi, brauzer View Transitions API shu nom orqali ularni bitta
 * elementdek "ko'chirib" o'tkazadi (catalog-listing.tsx).
 */
export function productImageTransitionName(id: string): string {
  return `elx-product-${id}`;
}

/** Butun katalog bo'ylab `product.id` orqali qidiradi (o'tish animatsiyasi uchun). */
export function findCatalogProductById(
  id: string,
): { collection: CatalogCollection; product: CatalogProductVariant } | undefined {
  for (const collection of CATALOG_COLLECTIONS) {
    const product = collection.products.find((p) => p.id === id);
    if (product) return { collection, product };
  }
  return undefined;
}

/**
 * `count` ta elementni tasodifiy, takrorlanmas tartibda tanlaydi.
 * Server component render vaqtida bir marta chaqiriladi (natija HTML'ga
 * "quyiladi") — shuning uchun hydration mos kelmasligi yo'q.
 */
export function pickRandomProducts<T>(
  items: readonly T[],
  count: number,
): T[] {
  const pool = [...items];
  const picked: T[] = [];
  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}
