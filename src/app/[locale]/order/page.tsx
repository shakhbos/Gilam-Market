import OrderPage from '@/views/order'
import React from 'react'
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Order' });

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
      <OrderPage />
    </>
  )
}
