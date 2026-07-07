import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { fetchData } from "@/service/get";
import HomePage from "@/views/home";
import { SITE_URL } from "@/utils/seo";
import { localizedAlternates } from "@/utils/metadata";
import type { PageProps } from "@/types/next";
import type { PaginatedResponse, QrBaseProduct } from "@/types/api";

type HomeSearchParams = {
  search?: string;
  style?: string;
  shape?: string;
  color?: string;
  width?: string;
  length?: string;
};

export async function generateMetadata({
  params,
}: PageProps<{ locale: string }, HomeSearchParams>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title") || "Gilam Market",
    description: t("description") || undefined,
    alternates: localizedAlternates(locale, "/"),
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}) {
  const { search } = await searchParams;

  const products = await fetchData<PaginatedResponse<QrBaseProduct>>(
    `${process.env.NEXT_PUBLIC_URL}/qr-base/i-market`,
    {
      page: 1,
      limit: 10,
      status: "published",
      search: search || undefined,
    },
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gilam Market",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description:
      "Turkish, Iranian and Uzbek carpets - only premium quality and affordable prices.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage product={products?.items ?? []} search={search} />
    </>
  );
}
