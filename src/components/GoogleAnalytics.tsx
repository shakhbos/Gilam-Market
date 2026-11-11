"use client";

import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** GA4 tavsiya etilgan hodisa nomi — "Заявка" yuborildi (Key event sifatida belgilanadi). */
export const GA4_LEAD_EVENT = "generate_lead";

export function gaEvent(name: string, params?: Record<string, unknown>) {
  try {
    window.gtag?.("event", name, params ?? {});
  } catch {
    // analitika sayt ishini buzmasin
  }
}

/**
 * Google Analytics 4 — ID har do'kon (tenant) uchun o'zi
 * (`Shop.metaSettings.analytics.ga4Id`). ID yo'q bo'lsa hech narsa yuklanmaydi.
 * Sahifa almashishini GA4 "Enhanced measurement" (brauzer tarixi) o'zi sanaydi.
 */
export default function GoogleAnalytics({ measurementId }: { measurementId: string | null | undefined }) {
  const id = measurementId && /^G-[A-Z0-9]{4,16}$/.test(measurementId) ? measurementId : null;
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
