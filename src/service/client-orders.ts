/*
 * Mehmon (hali Client/User bo'lmagan) "Заявка" yuborishi — `POST /client-orders`,
 * `@Public()`, auth kerak emas (Real-Grm/I-MANAGER.md, 2026-10-23, P1).
 * Client component'dan to'g'ridan-to'g'ri chaqiriladi (browser fetch, SSR emas),
 * shuning uchun `tenant-shop.ts`dagi kabi Next.js `headers()` ishlatib
 * bo'lmaydi — o'rniga `window.location.hostname`ni `X-Shop-Host` sifatida
 * uzatamiz (backend `TenantMiddleware` xuddi shu header'ni birinchi navbatda
 * o'qiydi). Bu Elexus uchun ham, kelajakda Gilam Market ulangach ham
 * ishlaydi — slug hech qayerda hardcode qilinmagan.
 */

const API_BASE = process.env.NEXT_PUBLIC_URL || "https://api.gilam-market.uz/api";

export type SubmitGuestOrderPayload = {
  client_order_items: { product: string; count: number }[];
  guestName: string;
  guestPhone: string;
  full_address: string;
  delivery_comment?: string;
  payment_type: "IN_HAND" | "PAYME";
};

export async function submitGuestClientOrder(payload: SubmitGuestOrderPayload): Promise<void> {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";

  const res = await fetch(`${API_BASE}/client-orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Shop-Host": hostname,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = data?.message;
    throw new Error(
      Array.isArray(message) ? message[0] : message || "Buyurtma yuborishda xatolik",
    );
  }
}
