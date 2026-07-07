import { fetchData } from "../../service/get";
import HomePage from "../../views/home";
import { SITE_URL } from "../../utils/seo";
import { Metadata } from "next";

async function getProduct(search) {
  return fetchData(`${process.env.NEXT_PUBLIC_URL}/qr-base/i-market`, {
    page: 1,
    limit: 10,
    status: "published",
    search: search || undefined
  })
}

export const metadata: Metadata = {
  title: "Gilam Market",
};
export default async function Home({ searchParams }: { searchParams: Promise<any> }) {
  const { search,
    // style, shape, color, width, length 
  } = await searchParams;
  const product = await fetchData(`${process.env.NEXT_PUBLIC_URL}/qr-base/i-market`, {
    page: 1,
    limit: 10,
    status: "published",
    search: search || undefined,
    // style: style || undefined,
    // shape: shape || undefined,
    // color: color || undefined,
    // width: width || undefined,
    // length: length || undefined,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gilam Market',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: 'Turkish, Iranian and Uzbek carpets - only premium quality and affordable prices.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage product={product?.items} search={search} />
    </>
  );
}
