import { cache } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { fetchData } from "@/service/get";
import { minio_img_url } from "@/utils/divice";
import { SITE_URL } from "@/utils/seo";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import GlamById from "@/views/glam-id";
import type { PaginatedResponse, QrBaseProduct } from "@/types/api";

type LocaleParams = { id: string; locale: string };
type GlamSearchParams = {
  modelId?: string;
  color?: string;
  collectionId?: string;
};

/**
 * Bitta QrBase mahsulotini olib keladi. `cache()` React 19 helper — bir
 * render davomida `generateMetadata` va sahifa komponenti bir marta chaqiradi.
 */
const getSingleProduct = cache(
  async (id: string): Promise<QrBaseProduct | null> =>
    fetchData<QrBaseProduct>(
      `${process.env.NEXT_PUBLIC_URL}/qr-base/i-market/${id}`,
    ),
);

/**
 * Joriy USD → UZS kursi. Backend /currency public endpoint'idan oxirgi
 * yozuvni oladi (format: {items: [{usd, uzs}]}, ular buffer nusxa: 100$ = X so'm).
 * usdRate = uzs / usd.
 */
const getUsdRate = cache(async (): Promise<number> => {
  const res = await fetchData<{ items?: Array<{ usd?: string | number; uzs?: string | number }> }>(
    `${process.env.NEXT_PUBLIC_URL}/currency`,
    { limit: 1, page: 1 },
  );
  const item = res?.items?.[0];
  const usd = Number(item?.usd || 0);
  const uzs = Number(item?.uzs || 0);
  return usd > 0 ? uzs / usd : 0;
});

/**
 * "Shu mahsulotdan boshqa" — o'xshash productlarni katalog qidiruvi orqali
 * olamiz. Backend `productId` param'ini ignore qiladi (whitelist uchun kerak),
 * ishlaydigan filter — `search` (multi-word).
 */
async function getRelatedProducts(params: {
  search: string;
  productId: string;
}): Promise<QrBaseProduct[]> {
  const data = await fetchData<PaginatedResponse<QrBaseProduct>>(
    `${process.env.NEXT_PUBLIC_URL}/qr-base/i-market`,
    {
      page: 1,
      limit: 20,
      status: "published",
      search: params.search,
      productId: params.productId,
    },
  );
  return data?.items ?? [];
}

export async function generateMetadata(
  { params }: { params: Promise<LocaleParams> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id, locale } = await params;
  const product = await getSingleProduct(id);

  if (!product) {
    return { title: "Mahsulot topilmadi | Gilam Market" };
  }

  const parentMeta = await parent;
  const previousImages = parentMeta.openGraph?.images || [];

  const modelTitle = product.model?.title ?? "";
  const collectionTitle =
    product.collection?.internetTitle?.trim() ||
    product.collection?.title ||
    "";

  const title =
    [modelTitle, collectionTitle].filter(Boolean).join(" — ") || "Gilam";
  const description =
    product.internetInfo?.trim() ||
    `${collectionTitle} kolleksiyasidagi ${modelTitle} modeli — Gilam Market.`;

  const canonicalUrl = `${SITE_URL}/${locale}/glam/${id}`;
  const heroImage = product.imgUrl?.path
    ? `${minio_img_url}${product.imgUrl.path}`
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        uz: `${SITE_URL}/uz/glam/${id}`,
        ru: `${SITE_URL}/ru/glam/${id}`,
        en: `${SITE_URL}/en/glam/${id}`,
      },
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      images: heroImage ? [heroImage, ...previousImages] : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: heroImage ? [heroImage] : undefined,
    },
  };
}

export default async function GilamById({
  params,
  searchParams,
}: {
  params: Promise<LocaleParams>;
  searchParams: Promise<GlamSearchParams>;
}) {
  const { id, locale } = await params;
  const sp = await searchParams;

  const [product, t, usdRate] = await Promise.all([
    getSingleProduct(id),
    getTranslations({ locale, namespace: "Layout" }),
    getUsdRate(),
  ]);

  if (!product) {
    notFound();
  }

  const searchTerms = [sp?.modelId, sp?.color, sp?.collectionId]
    .filter(Boolean)
    .join(" ")
    .trim();
  const related = await getRelatedProducts({
    search: searchTerms,
    productId: id,
  });

  const heroImageUrl = product.imgUrl?.path
    ? `${minio_img_url}${product.imgUrl.path}`
    : undefined;
  const canonicalUrl = `${SITE_URL}/${locale}/glam/${id}`;

  // Schema.org Product — SEO uchun rich snippet.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: [product.model?.title, product.collection?.title]
      .filter(Boolean)
      .join(" ")
      .trim(),
    sku: product.code,
    image: heroImageUrl ? [heroImageUrl] : [],
    description: product.internetInfo ?? undefined,
    brand: product.collection?.title
      ? { "@type": "Brand", name: product.collection.title }
      : undefined,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      price: Number(product.i_price ?? 0),
      priceCurrency: "UZS",
      availability: (product.sizes?.length ?? 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbItems = [
    {
      name: t("menu") || "Bosh sahifa",
      url: `${SITE_URL}/${locale}`,
    },
    {
      name: product.collection?.title || "Kolleksiya",
      url: `${SITE_URL}/${locale}/?collection=${product.collection?.id ?? ""}`,
    },
    {
      name: product.model?.title || "Mahsulot",
      url: canonicalUrl,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <GlamById
        id={id}
        locale={locale}
        product={product}
        relatedProducts={related}
        usdRate={usdRate}
      />
    </>
  );
}
