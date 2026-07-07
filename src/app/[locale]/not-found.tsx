'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
    const t = useTranslations('NotFound');

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('title')}</h2>
            <p className="text-gray-600 mb-8 max-w-md">{t('description')}</p>
            <Link
                href="/"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
                {t('button')}
            </Link>
        </div>
    );
}
