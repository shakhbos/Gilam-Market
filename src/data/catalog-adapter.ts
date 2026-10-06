import { minio_img_url } from "@/utils/divice";
import { formatSumElexus } from "@/utils/format-sum-elexus";
import { slugify } from "@/utils/slugify";
import type { ApiCatalogGroup, ApiGroupDetail } from "@/service/catalog-public";
import type { CatalogCollection, CatalogDetailSpec, CatalogProductVariant, CatalogSpec } from "./catalog-elexus";

/*
 * Haqiqiy backend javobini (`shop-product/public/catalog*`) mavjud
 * `CatalogCollection`/`CatalogProductVariant` shakliga moslashtiradi —
 * shunda `catalog-listing.tsx`/`catalog-collection-row.tsx`/
 * `catalog-product-detail.tsx` kabi sayqallangan UI (View Transitions,
 * sticky accordion, animatsiyalar) O'ZGARTIRILMAYDI, faqat ma'lumot manbai
 * almashadi (3-bosqich, OPERATOR-ROADMAP.md, 2026-10-06).
 *
 * `MATERIAL_LABELS`/`INTERIOR_STYLE_LABELS` — backend'dagi
 * `Real-Grm-Back/src/modules/collection/dto/update-collection-characteristics.dto.ts`
 * bilan QO'LDA SINXRON saqlanishi kerak (ru qiymatlar) — API hozircha
 * neytral kalit (`wool`, `classic`...) qaytaradi, locale'ga mos label'ni
 * backend emas, shu yer hal qiladi.
 */

const MATERIAL_LABELS: Record<string, string> = {
  wool: "Шерсть",
  silk: "Шёлк",
  viscose: "Вискоза",
  acrylic: "Акрил",
  cotton: "Хлопок",
  wool_silk: "Шерсть и шёлк",
  wool_viscose: "Шерсть и вискоза",
  synthetic: "Синтетика",
};

const INTERIOR_STYLE_LABELS: Record<string, string> = {
  minimalism: "Минимализм",
  neoclassic: "Неоклассика",
  classic: "Классика",
  oriental: "Восточный",
  loft: "Лофт",
  art_deco: "Ар-деко",
};

/** Hozircha barcha mahsulotlarda bitta xil (demo'dan meros) — real
 * ma'lumotda yo'q, operator kiritadigan maydon emas (biznes siyosati). */
const POLICY_DETAIL_SPECS: readonly CatalogDetailSpec[] = [
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

function materialLabel(keys: string[] | null): string {
  if (!keys?.length) return "—";
  return keys.map((k) => MATERIAL_LABELS[k] || k).join(", ");
}

function interiorStyleLabel(keys: string[] | null): string {
  if (!keys?.length) return "—";
  return keys.map((k) => INTERIOR_STYLE_LABELS[k] || k).join(", ");
}

function formatSize(s: { x: number | string; y: number | string }): string {
  const x = Math.round(Number(s.x) * 100);
  const y = Math.round(Number(s.y) * 100);
  return `${x}×${y}`;
}

function imageUrl(path: string | null | undefined): string {
  return path ? `${minio_img_url}${path}` : "";
}

/** `collection.description[0]`/`[1]` — real matn bitta qator, 2 ta qismga
 * birinchi bo'sh qatordan (yoki yo'q bo'lsa — yarmidan) bo'linadi. */
function splitDescription(text: string | null | undefined): readonly [string, string] {
  const trimmed = (text || "").trim();
  if (!trimmed) return ["", ""];
  const parts = trimmed.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) return [parts[0], parts.slice(1).join(" ")];
  return [trimmed, ""];
}

function buildSpecs(group: ApiCatalogGroup, sizeStrings: string[], price: number): CatalogSpec[] {
  return [
    { label: "Плотность", value: group.density ? `${group.density} узлов/м²` : "—" },
    { label: "Материал", value: materialLabel(group.material) },
    { label: "Размеры", value: sizeStrings.join(" · ") || "—" },
    { label: "Цена", value: price ? `от ${formatSumElexus(price)} сум` : "—" },
  ];
}

function buildDetailSpecs(
  origin: { country: string | null; factory: string | null } | null,
  density: string | null,
  pileHeight: string | null,
  material: string[] | null,
  interiorStyle: string[] | null,
  care: string | null,
): CatalogDetailSpec[] {
  const originValue = [origin?.country, origin?.factory].filter(Boolean).join(", ");
  return [
    ...(originValue ? [{ label: "Происхождение", value: originValue }] : []),
    { label: "Материал", value: materialLabel(material) },
    { label: "Плотность", value: density ? `${density} узлов/м²` : "—" },
    { label: "Высота ворса", value: pileHeight ? `${pileHeight} мм` : "—" },
    { label: "Стиль интерьера", value: interiorStyleLabel(interiorStyle) },
    { label: "Уход", value: care || "—" },
    ...POLICY_DETAIL_SPECS,
  ];
}

function buildProduct(group: ApiCatalogGroup, collectionTitle: string, index: number): CatalogProductVariant {
  const img = imageUrl(group.imgPath);
  const modelTitle = group.shapeTitle ? `${group.modelTitle} (${group.shapeTitle})` : group.modelTitle;
  return {
    id: `${group.modelId}:${group.shapeId}`,
    slug: slugify(group.shapeTitle ? `${group.modelTitle}-${group.shapeTitle}` : group.modelTitle),
    sku: `n°${String(index + 1).padStart(4, "0")}`,
    name: `${collectionTitle} · ${modelTitle}`,
    modelTitle,
    image: img,
    gallery: img ? [img] : [],
  };
}

/** /catalog ro'yxati va /catalog/[collection] uchun — nashr etilgan BARCHA
 * guruhlarni `collectionTitle` bo'yicha birlashtiradi. */
export function buildCatalogCollections(groups: ApiCatalogGroup[]): CatalogCollection[] {
  const byTitle = new Map<string, ApiCatalogGroup[]>();
  for (const g of groups) {
    const list = byTitle.get(g.collectionTitle) ?? [];
    list.push(g);
    byTitle.set(g.collectionTitle, list);
  }

  const collections: CatalogCollection[] = [];
  for (const [title, items] of byTitle) {
    const first = items[0];
    const sizeByKey = new Map<string, { x: number; y: number }>();
    for (const g of items) {
      for (const s of g.sizes || []) {
        sizeByKey.set(`${s.x}:${s.y}`, { x: Number(s.x), y: Number(s.y) });
      }
    }
    const sizes = [...sizeByKey.values()].sort((a, b) => a.x * a.y - b.x * b.y);
    const sizeStrings = sizes.map(formatSize);
    const price = Number(first.price || 0);
    const minSize = sizes[0];
    const pricePerSqmFrom =
      minSize && minSize.x * minSize.y > 0
        ? `от ${formatSumElexus(Math.round(price / (minSize.x * minSize.y)))} сум за м2`
        : "";
    const totalCount = items.reduce((sum, g) => sum + (g.totalCount || 0), 0);

    collections.push({
      id: first.collectionId,
      slug: slugify(title),
      title,
      description: splitDescription(first.description),
      specs: buildSpecs(first, sizeStrings, price),
      detailSpecs: buildDetailSpecs(
        null,
        first.density,
        first.pileHeight,
        first.material,
        first.interiorStyle,
        first.care,
      ),
      price,
      pricePerSqmFrom,
      sizes: sizeStrings,
      maxQuantity: Math.max(1, totalCount),
      products: items.map((g, i) => buildProduct(g, title, i)),
    });
  }
  return collections;
}

/** /catalog/[collection]/[model] uchun — ro'yxatdan topilgan kolleksiya/
 * mahsulotni `group-detail` javobi (galereya, rang, kelib chiqishi) bilan
 * boyitadi. */
export function enrichWithGroupDetail(
  collection: CatalogCollection,
  product: CatalogProductVariant,
  detail: ApiGroupDetail,
): { collection: CatalogCollection; product: CatalogProductVariant } {
  const gallery = detail.media.length
    ? detail.media.filter((m) => m.mediaType === "image").map((m) => imageUrl(m.mediaUrl))
    : product.gallery;
  const heroImage = detail.colors[0]?.imgPath ? imageUrl(detail.colors[0].imgPath) : product.image;

  const enrichedProduct: CatalogProductVariant = {
    ...product,
    image: heroImage || product.image,
    gallery: gallery.length ? gallery : product.gallery,
  };

  const enrichedCollection: CatalogCollection = {
    ...collection,
    description: splitDescription(detail.collection?.description),
    detailSpecs: buildDetailSpecs(
      { country: detail.collection?.originCountry ?? null, factory: detail.collection?.originFactory ?? null },
      detail.collection?.density ?? null,
      detail.collection?.pileHeight ?? null,
      detail.collection?.material ?? null,
      detail.collection?.interiorStyle ?? null,
      detail.collection?.care ?? null,
    ),
  };

  return { collection: enrichedCollection, product: enrichedProduct };
}
