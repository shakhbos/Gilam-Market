import { headers } from "next/headers";
import { cache } from "react";

/**
 * Tenant shop public info — per-domain multi-tenant resolver.
 *
 * Server-side helper. Request'ning Host header'i backend GET /shop/public'ga
 * forward qilinadi va shop info qaytariladi (title, brand, colors, socials).
 *
 * Ishlatish (server component / metadata):
 *   const shop = await getTenantShop();
 *   const title = shop?.title ?? "Gilam Market";
 *
 * React `cache()` wrapper — bitta request ichida ko'p chaqirilsa faqat 1 marta
 * backendga boradi. Bunday page + metadata + layout uch marta chaqirishlarni
 * bir marotabaga aylantiradi.
 */

export type TenantShop = {
  id: string;
  slug: string;
  domain: string | null;
  title: string;
  description: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  address: string | null;
  phone: string | null;
  workHours: Record<string, any> | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  telegramChannelUrl: string | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_URL || "https://api.gilam-market.uz/api";

// Skip domenlari — bularda tenant kerak emas, default brand ishlatiladi
const SKIP_HOSTS = new Set([
  "gilam-market.uz",
  "www.gilam-market.uz",
  "localhost",
  "127.0.0.1",
]);

export const getTenantShop = cache(async (): Promise<TenantShop | null> => {
  try {
    const h = await headers();
    const rawHost =
      h.get("x-forwarded-host") || h.get("host") || "";
    const hostname = rawHost.split(":")[0].toLowerCase().trim();

    if (!hostname || SKIP_HOSTS.has(hostname)) {
      return null;
    }

    const res = await fetch(`${API_BASE}/shop/public`, {
      method: "GET",
      // SSR fetch api.gilam-market.uz'ga boradi, shu sabab Host header'ida
      // API domeni bo'ladi. Tenant domenni alohida `X-Shop-Host` header'i
      // orqali uzatamiz — backend TenantMiddleware avval shu header'ni
      // o'qib, keyin Host'ga fallback qiladi.
      headers: {
        "X-Shop-Host": hostname,
        Accept: "application/json",
      },
      // Shop info kam o'zgaradi — 60s ISR mos keladi.
      next: { revalidate: 60, tags: [`shop:${hostname}`] },
    });

    if (!res.ok) {
      // 404 — bu domen uchun shop yo'q; default brand chizamiz
      if (res.status !== 404) {
        console.error(
          `[getTenantShop] ${res.status} ${res.statusText} for host=${hostname}`,
        );
      }
      return null;
    }

    return (await res.json()) as TenantShop;
  } catch (err) {
    console.error("[getTenantShop] network error:", err);
    return null;
  }
});
