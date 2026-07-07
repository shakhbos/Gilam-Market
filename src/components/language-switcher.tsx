"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";

const LOCALES = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

/**
 * Til almashtiruvchi. Aktiv locale — qalin (bold, 100% opacity);
 * boshqalar — 60% opacity. Klik qilinganda next-intl router bilan
 * bir xil pathname bo'yicha yangi locale'ga o'tadi (URL segmenti
 * almashadi, query params saqlanadi).
 */
export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: LocaleCode) => {
    if (next === locale || pending) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l) => {
        const isActive = l.code === locale;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => switchTo(l.code)}
            aria-pressed={isActive}
            disabled={pending}
            className={`text-[14px] leading-none tracking-wide transition-opacity ${
              isActive
                ? "font-bold text-[#212121] opacity-100"
                : "font-normal text-[#212121] opacity-60 hover:opacity-100"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
