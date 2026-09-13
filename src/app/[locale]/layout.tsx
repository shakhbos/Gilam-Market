import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import NextTopLoader from 'nextjs-toploader';
import "../globals.css";
import FixedLayout from "../../components/fixed-layout";
import StoreProvider from "./store-provider";
import { ToastContainer } from 'react-toastify';
import { Metadata } from 'next';
import { SITE_URL } from '../../utils/seo';
import { Inter } from 'next/font/google';
import { Suspense } from "react";
import Metrika from "@/components/Metrika";
import type { LayoutProps, MetadataProps } from '@/types/next';
import { getTenantShop } from "../../service/tenant-shop";

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

// Fallback ranglar — tenant shop primary/secondary ranglar yo'q bo'lsa
const DEFAULT_PRIMARY = "#2299DD";
const DEFAULT_SECONDARY = "#F97316";

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, shop] = await Promise.all([
    getTranslations({ locale, namespace: 'Metadata' }),
    getTenantShop(),
  ]);

  // Tenant nomlari (Elexus, va h.k.) SEO'da ustuvor bo'lsin.
  // Tenant yo'q bo'lsa (default gilam-market.uz) — hozirgi Gilam Market brand.
  const brandTitle = shop?.title || t('title') || 'Gilam Market';
  const brandDescription =
    shop?.description || t('description') || 'Gilam Market — sifatli gilamlar va qulay narxlar';
  const brandOgTitle =
    shop?.title || t('ogTitle') || "Gilam Market - Premium gilamlar va poyandozlar onlayn";
  const brandOgDescription =
    shop?.description || t('ogDescription') || 'Gilam Market — sifatli gilamlar va qulay narxlar';

  // Site URL — tenant domeni bo'lsa o'sha, aks holda default
  const siteUrl = shop?.domain ? `https://${shop.domain}` : SITE_URL;
  const ogImage = shop?.logoUrl || `${siteUrl}/logo.svg`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: brandTitle,
      template: `%s | ${brandTitle}`,
    },
    description: brandDescription,
    icons: shop?.faviconUrl
      ? { icon: shop.faviconUrl }
      : undefined,
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : locale === 'ru' ? 'ru_RU' : 'uz_UZ',
      url: siteUrl,
      siteName: brandTitle,
      title: brandOgTitle,
      description: brandOgDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${brandTitle} Logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: brandTitle,
      description: brandDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'ru': '/ru',
        'uz': '/uz',
      },
    },
    keywords: [
      'gilam', 'carpet', 'rug', 'gilam market', 'uzbekistan carpets', 'tashkent gilam',
      'turkish carpets', 'iranian rugs', 'online shop', 'buy carpet', 'gilam narxlari',
      'arzon gilamlar', 'quality rugs', 'interior design'
    ],
    authors: [{ name: `${brandTitle} Team` }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const [messages, shop] = await Promise.all([
    getMessages(),
    getTenantShop(),
  ]);

  // Tenant brand ranglari — CSS variables orqali Tailwind/inline stillarda
  // ishlatilishi mumkin. Tenant yo'q bo'lsa default rang'i.
  const primary = shop?.primaryColor || DEFAULT_PRIMARY;
  const secondary = shop?.secondaryColor || DEFAULT_SECONDARY;

  return (
    <html
      lang={locale}
      style={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ["--tenant-primary" as any]: primary,
        ["--tenant-secondary" as any]: secondary,
      }}
    >
      <body className={inter.className}>
        <NextTopLoader
          color={primary}
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow={`0 0 10px ${primary},0 0 5px ${primary}`}
        />
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <main className="min-h-screen">
              {children}
            </main>
            <ToastContainer />
            <FixedLayout />
          </StoreProvider>
        </NextIntlClientProvider>
        <Suspense>
          <Metrika />
        </Suspense>
      </body>
    </html>
  );
}
