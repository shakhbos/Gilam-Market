/**
 * Elexus — so'm miqdorini "1 910 000" ko'rinishida formatlaydi.
 * `catalog-product-detail.tsx`da avval alohida nusxada edi (savat ham
 * xuddi shu formatga muhtoj bo'lgach, bu yerga ko'chirildi).
 */
export function formatSumElexus(price: number): string {
  return price.toLocaleString("ru-RU").replace(/ /g, " ");
}
