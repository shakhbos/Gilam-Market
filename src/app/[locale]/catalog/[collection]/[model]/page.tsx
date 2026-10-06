import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTenantShop } from "@/service/tenant-shop";
import CatalogProductElexus from "@/views/catalog-product-elexus";
import { buildCatalogCollections, enrichWithGroupDetail } from "@/data/catalog-adapter";
import { fetchCatalogGroups, fetchGroupDetail } from "@/service/catalog-public";
import { localizedAlternates } from "@/utils/metadata";
import type { PageProps } from "@/types/next";

type Params = { locale: string; collection: string; model: string };

/** Ro'yxatdan slug bo'yicha kolleksiya+mahsulotni topadi, so'ng
 * `group-detail`dan (galereya, rang, kelib chiqishi) boyitadi. Haqiqiy
 * `collectionId`/`modelId`/`shapeId` ro'yxat javobidan keladi — URL'da
 * faqat slug bor. */
async function resolveProduct(shopSlug: string, collectionSlug: string, modelSlug: string) {
  const groups = await fetchCatalogGroups(shopSlug);
  const collections = buildCatalogCollections(groups);
  const collection = collections.find((c) => c.slug === collectionSlug);
  const product = collection?.products.find((p) => p.slug === modelSlug);
  if (!collection || !product) return null;

  const apiGroup = groups.find(
    (g) => `${g.modelId}:${g.shapeId}` === product.id,
  );
  if (!apiGroup) return { collection, product };

  const detail = await fetchGroupDetail(shopSlug, apiGroup.collectionId, apiGroup.modelId, apiGroup.shapeId);
  if (!detail) return { collection, product };
  return enrichWithGroupDetail(collection, product, detail);
}

export async function generateMetadata({
  params,
}: PageProps<Params, Record<string, never>>): Promise<Metadata> {
  const { locale, collection: slug, model } = await params;
  const shop = await getTenantShop();
  const resolved = shop ? await resolveProduct(shop.slug, slug, model) : null;
  return {
    title: resolved
      ? `${resolved.collection.title} ${resolved.product.modelTitle} — Elexus Gilam`
      : "Каталог",
    alternates: localizedAlternates(locale, `/catalog/${slug}/${model}`),
  };
}

/**
 * /catalog/[collection]/[model] — bitta model (Figma frame 100:803).
 * Faqat Elexus tenant uchun va faqat mavjud kolleksiya+model uchun —
 * aks holda 404 (catalog/page.tsx bilan bir xil qoida).
 */
export default async function CatalogProductPage({
  params,
}: PageProps<Params, Record<string, never>>) {
  const { collection: slug, model } = await params;
  const shop = await getTenantShop();
  const resolved = shop?.slug === "elexus" ? await resolveProduct(shop.slug, slug, model) : null;

  if (shop?.slug === "elexus" && resolved) {
    return (
      <CatalogProductElexus shop={shop} collection={resolved.collection} product={resolved.product} />
    );
  }
  notFound();
}
