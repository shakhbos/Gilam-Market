/**
 * Elexus — savat sahifasi uchun hisob-kitob yordamchilari (Figma 100:931).
 */

/** "250×350" (sm) dan maydonni m²da hisoblaydi — "250×350" → 8.75. */
export function parseSizeAreaSqm(size: string): number {
  const match = size.match(/(\d+)\s*[×x]\s*(\d+)/i);
  if (!match) return 0;
  const [, w, h] = match;
  return Math.round((Number(w) / 100) * (Number(h) / 100) * 100) / 100;
}

/** "8,75" ko'rinishida (ru-RU vergul bilan), 2 xonagacha. */
export function formatAreaSqm(area: number): string {
  return area.toLocaleString("ru-RU", {
    minimumFractionDigits: area % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/** Rus tilida "ковёр/ковра/ковров" sonlarga mos shaklda. */
export function pluralizeCarpets(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "ковёр";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "ковра";
  return "ковров";
}

/** ISO sanadan "19.09.2026" ko'rinishi. */
export function formatCartDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}
