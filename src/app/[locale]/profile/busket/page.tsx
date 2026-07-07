import React from 'react'
import BusketPage from '../../../../views/busket'
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Basket' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    }
  };
}

export default function page() {
  return (
    <>
      <BusketPage />
    </>
  )
}
