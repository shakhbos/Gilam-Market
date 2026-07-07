import type { QrBaseProduct } from "@/types/api";

/**
 * Kartochkada o'lchamlar diapazoni: eng kichik va eng katta o'lchamdan
 * "60x110 – 160x230" ko'rinishida qatorlaydi. Faqat 1 xil o'lcham bo'lsa —
 * "60x110". Backend `group_sizes` bo'sh yoki mavjud emas bo'lsa fallback
 * sifatida QrBase'ning o'z `size.title`'iga qaytadi.
 */
export function formatSizeRange(item: QrBaseProduct): string {
  const gs = Array.isArray(item.group_sizes) ? item.group_sizes : [];
  const active = gs.filter((s) => Number(s.count) > 0);
  if (!active.length) return item?.size?.title ?? "";
  const first = active[0];
  const last = active[active.length - 1];
  const label = (s: { x: number; y: number }) =>
    `${Math.round(Number(s.x || 0) * 100)}x${Math.round(Number(s.y || 0) * 100)}`;
  const a = label(first);
  const b = label(last);
  return a === b ? a : `${a} – ${b}`;
}
