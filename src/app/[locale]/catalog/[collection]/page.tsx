import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTenantShop } from "@/service/tenant-shop";
import CatalogCollectionElexus from "@/views/catalog-collection-elexus";
import { buildCatalogCollections } from "@/data/catalog-adapter";
import { fetchCatalogGroups } from "@/service/catalog-public";
import { localizedAlternates } from "@/utils/metadata";
import type { PageProps } from "@/types/next";

type Params = { locale: string; collection: string };

async function resolveCollection(shopSlug: string, slug: string) {
  const groups = await fetchCatalogGroups(shopSlug);
  const collections = buildCatalogCollections(groups);
  return collections.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<Params, Record<string, never>>): Promise<Metadata> {
  const { locale, collection: slug } = await params;
  const shop = await getTenantShop();
  const collection = shop ? await resolveCollection(shop.slug, slug) : undefined;
  return {
    title: collection ? `${collection.title} — Elexus Gilam` : "Каталог",
    alternates: localizedAlternates(locale, `/catalog/${slug}`),
  };
}

/**
 * /catalog/[collection] — bitta kolleksiyaning barcha modellari.
 * Figma frame 100:1388. Faqat Elexus tenant uchun (catalog/page.tsx bilan
 * bir xil qoida) va faqat mavjud slug uchun — aks holda 404.
 */
export default async function CatalogCollectionPage({
  params,
}: PageProps<Params, Record<string, never>>) {
  const { collection: slug } = await params;
  const shop = await getTenantShop();
  const collection = shop?.slug === "elexus" ? await resolveCollection(shop.slug, slug) : undefined;

  if (shop?.slug === "elexus" && collection) {
    return <CatalogCollectionElexus shop={shop} collection={collection} />;
  }
  notFound();
}
