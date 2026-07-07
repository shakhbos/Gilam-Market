import { fetchData } from "@/service/get";
import GlamById from "../../../../views/glam-id";
import { Metadata, ResolvingMetadata } from 'next';
import { SITE_URL } from "@/utils/seo";
import { minio_img_url } from "@/utils/divice";

async function getSingleProduct(id: string) {
  return fetchData(`${process.env.NEXT_PUBLIC_URL}/qr-base/i-market/${id}`);
}
async function getProduct({ search, productId }: { search: string, productId: string }) {
  return fetchData(`${process.env.NEXT_PUBLIC_URL}/qr-base/i-market`, {
    page: 1,
    limit: 20,
    status: "published",
    search,
    productId
  });
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getSingleProduct(id);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product[0]?.model?.title || ''} ${product[0]?.collection?.title || ''}`,
    description: product[0]?.internetInfo || 'Product details',
    openGraph: {
      images: product[0]?.imgUrl?.path ? [`${minio_img_url}${product[0].imgUrl.path}`, ...previousImages] : previousImages,
    },
  };
}

import { getTranslations } from 'next-intl/server';
import BreadcrumbSchema from '@/components/breadcrumb-schema';

export default async function GilamById({ params, searchParams }: { params: Promise<{ id: string, locale: string }>, searchParams: Promise<any> }) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Layout' });
  const sp = await searchParams;
  const oneProduct = await getSingleProduct(id);
  const product = await getProduct({ search: sp?.modelId + " " + sp?.color + " " + sp?.collectionId, productId: id });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: oneProduct?.[0]?.model?.title,
    image: oneProduct?.[0]?.imgUrl?.path ? [`${minio_img_url}${oneProduct?.[0].imgUrl.path}`] : [],
    description: oneProduct?.[0]?.internetInfo,
    brand: {
      '@type': 'Brand',
      name: oneProduct?.[0]?.collection?.title
    },
    offers: {
      '@type': 'Offer',
      price: oneProduct?.[0]?.i_price,
      priceCurrency: 'UZS',
      availability: 'https://schema.org/InStock',
    }
  };

  const breadcrumbItems = [
    {
      name: t('menu') || 'Home', // Fallback to 'Home' if translation fails, though 'menu' might not be the best key. 'Home' is usually separate. Let's check keys.
      url: `${SITE_URL}/${locale}`
    },
    {
      name: oneProduct?.[0]?.collection?.title || 'Collection',
      url: `${SITE_URL}/${locale}/?collection=${oneProduct?.[0]?.collection?.id}`
    },
    {
      name: oneProduct?.[0]?.model?.title,
      url: `${SITE_URL}/${locale}/glam/${id}`
    }
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
        product={oneProduct}
        productArr={product?.items}
      />
    </>
  );
}
