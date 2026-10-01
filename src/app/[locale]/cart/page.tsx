import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTenantShop } from "@/service/tenant-shop";
import CartElexus from "@/views/cart-elexus";
import { localizedAlternates } from "@/utils/metadata";
import type { PageProps } from "@/types/next";

export async function generateMetadata({
  params,
}: PageProps<{ locale: string }, Record<string, never>>): Promise<Metadata> {
  const { locale } = await params;
  const shop = await getTenantShop();
  const title = shop?.slug === "elexus" ? "Корзина — Elexus Gilam" : "Корзина";
  return {
    title,
    alternates: localizedAlternates(locale, "/cart"),
  };
}

/**
 * /cart sahifa — hozircha faqat Elexus tenant uchun aktiv (Figma frame
 * 100:931), /catalog va /catalog/[collection]/[model] bilan bir xil qoida.
 */
export default async function CartPage() {
  const shop = await getTenantShop();
  if (shop?.slug === "elexus") {
    return <CartElexus shop={shop} />;
  }
  notFound();
}
