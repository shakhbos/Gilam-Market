import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTenantShop } from "@/service/tenant-shop";
import CatalogElexus from "@/views/catalog-elexus";
import { localizedAlternates } from "@/utils/metadata";
import type { PageProps } from "@/types/next";

export async function generateMetadata({
  params,
}: PageProps<{ locale: string }, Record<string, never>>): Promise<Metadata> {
  const { locale } = await params;
  const shop = await getTenantShop();
  const title = shop?.slug === "elexus" ? "Каталог — Elexus Gilam" : "Каталог";
  return {
    title,
    alternates: localizedAlternates(locale, "/catalog"),
  };
}

/**
 * /catalog sahifa — hozircha faqat Elexus tenant uchun aktiv.
 * Boshqa tenantlar Gilam Market'ning umumiy home'idagi katalogini ishlatadi
 * (bu URL'ga kelmasa keladi), shu sabab default hollar 404 ga o'tadi (yoki
 * kelajakda Gilam Market katalogi qo'shilsa shu joyda switch qilinadi).
 */
export default async function CatalogPage() {
  const shop = await getTenantShop();
  if (shop?.slug === "elexus") {
    return <CatalogElexus shop={shop} />;
  }
  notFound();
}
