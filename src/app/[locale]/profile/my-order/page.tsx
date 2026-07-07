import MyOrdersPage from "@/views/my-orders";
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { MetadataProps } from '@/types/next';

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'MyOrders' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
  };
}

export default function MyOrdersRoute() {
  return <MyOrdersPage />;
}
