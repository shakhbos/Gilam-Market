import type { Metadata } from "next";
import { SITE_URL } from "./seo";

/**
 * Bir vaqtning o'zida canonical + hreflang alternates (uz, ru, en) qaytaradi.
 * Statik sahifalar shu helperni ishlatib metadata yozadi — locale prefixida
 * duplicate content muammosi (Google ru va uz versiyalarini duplicate deb
 * qaramasin) hal bo'ladi.
 */
export function localizedAlternates(locale: string, path: string): NonNullable<Metadata["alternates"]> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: `${SITE_URL}/${locale}${normalized}`,
    languages: {
      uz: `${SITE_URL}/uz${normalized}`,
      ru: `${SITE_URL}/ru${normalized}`,
      en: `${SITE_URL}/en${normalized}`,
    },
  };
}
