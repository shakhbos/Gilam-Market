import { fetchData } from "@/service/get";
import MyOrdersPage from "@/views/my-orders";
import React from "react";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'MyOrders' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    }
  };
}

//

export default async function MyOrders() {



  return <MyOrdersPage />;
}
