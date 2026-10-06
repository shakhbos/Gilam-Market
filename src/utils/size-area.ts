/** `CatalogCollection.sizes`dagi har bir qiymat `formatSize()` bilan
 * "XXX×YYYY" (sm) ko'rinishiga keltirilgan (catalog-adapter.ts) — shu yerda
 * orqaga m²ga aylantiriladi, umumiy narx (Narx(so'm/м²) × maydon) hisoblash
 * uchun (catalog-product-detail.tsx, catalog-product-tile.tsx). */
export function sizeAreaM2(sizeStr: string): number {
  const [wCm, hCm] = sizeStr.split("×").map(Number);
  if (!wCm || !hCm) return 0;
  return (wCm / 100) * (hCm / 100);
}
