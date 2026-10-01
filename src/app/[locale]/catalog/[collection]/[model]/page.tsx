import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTenantShop } from "@/service/tenant-shop";
import CatalogProductElexus from "@/views/catalog-product-elexus";
import { getCatalogCollection, getCatalogProduct } from "@/data/catalog-elexus";
import { localizedAlternates } from "@/utils/metadata";
import type { PageProps } from "@/types/next";

type Params = { locale: string; collection: string; model: string };

export async function generateMetadata({
  params,
}: PageProps<Params, Record<string, never>>): Promise<Metadata> {
  const { locale, collection: slug, model } = await params;
  const collection = getCatalogCollection(slug);
  const product = collection && getCatalogProduct(collection, model);
  return {
    title: product
      ? `${collection!.title} ${product.modelTitle} — Elexus Gilam`
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
  const collection = getCatalogCollection(slug);
  const product = collection && getCatalogProduct(collection, model);

  if (shop?.slug === "elexus" && collection && product) {
    return (
      <CatalogProductElexus shop={shop} collection={collection} product={product} />
    );
  }
  notFound();
}
