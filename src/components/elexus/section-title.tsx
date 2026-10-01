/*
 * Elexus — seksiya sarlavhasi (umumiy).
 * ─────────────────────────────────────────────────────────────────────────
 * Figma'da sarlavhalar bir xil emas edi: "продукты из наличия" 16px/#222,
 * "Выберитие ковров..." esa 14px/#000. Kelishuv bo'yicha HAMMASI 16px
 * qilindi va shu yagona komponentga chiqarildi — yangi seksiyalar qo'shilganda
 * uslub o'z-o'zidan bir xil bo'lib qoladi.
 *
 * Uslub (Figma node 100:295):
 *   Inter Tight SemiBold · 16px · #222 · UPPERCASE
 *   letter-spacing -0.176px · line-height 1.5
 *
 * Oxiridagi "›" — Figma'dagi ">" belgisi (seksiya to'liq ro'yxatga havola).
 */

import { Link } from "@/i18n/routing";

export default function SectionTitle({
  children,
  /** Berilsa sarlavha havolaga aylanadi (to'liq ro'yxat sahifasi). */
  href,
  /** Figma node id — dizayn bilan solishtirish uchun. */
  nodeId,
}: {
  children: React.ReactNode;
  href?: string;
  nodeId?: string;
}) {
  const content = (
    <>
      {children}
      <span aria-hidden="true" className="ml-2">
        &gt;
      </span>
    </>
  );

  return (
    <h2
      className="text-[16px] font-semibold uppercase leading-[1.5] tracking-[-0.176px] text-[#222]"
      data-node-id={nodeId}
    >
      {href ? (
        <Link
          href={href}
          className="transition-opacity duration-150 hover:opacity-60"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </h2>
  );
}
