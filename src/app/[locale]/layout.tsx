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

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title') || 'Gilam Market',
      template: '%s | Gilam Market'
    },
    description: t('description') || 'Gilam Market — sifatli gilamlar va qulay narxlar',
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : locale === 'ru' ? 'ru_RU' : 'uz_UZ',
      url: SITE_URL,
      siteName: 'Gilam Market',
      title: t('ogTitle') || "Gilam Market - Premium gilamlar va poyandozlar onlayn",
      description: t('ogDescription') || 'Gilam Market — sifatli gilamlar va qulay narxlar',
      images: [
        {
          url: `${SITE_URL}/logo.svg`,
          width: 1200,
          height: 630,
          alt: 'Gilam Market Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title') || 'Gilam Market',
      description: t('description') || 'Gilam Market — sifatli gilamlar va qulay narxlar',
      images: [`${SITE_URL}/logo.svg`],
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
    authors: [{ name: 'Gilam Market Team' }],
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

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
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
