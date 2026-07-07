"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-scoped error boundary. `page.tsx` yoki quyi client component render
 * paytida xato tashlansa, foydalanuvchi 500 sahifasi o'rniga shu UI ni ko'radi.
 * `digest` — Next.js production build'da xato ID sini beradi (server log bilan
 * cross-reference qilish uchun).
 */
export default function ProductDetailError({ error, reset }: Props) {
  const t = useTranslations("NotFound");

  useEffect(() => {
    console.error("[glam/[id]] render error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        {t("title")}
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">{t("description")}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Retry
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          {t("button")}
        </Link>
      </div>
    </div>
  );
}
