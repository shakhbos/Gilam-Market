/**
 * URL-xavfsiz slug — kichik harf, bo'shliq/maxsus belgilar bitta "-"ga
 * almashadi, boshi/oxiridagi "-" olib tashlanadi. Katalog sahifalarining
 * (collection/model) URL segmentlari shundan foydalanadi.
 */
export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}
