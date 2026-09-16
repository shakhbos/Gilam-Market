"use client";

import { Link } from "@/i18n/routing";

/**
 * Footer seksiyasi (Figma 333:736, 333:770-775, 333:854-863, 333:519-571).
 *
 * Layout:
 *   - Chapda: "Elexus Hali" brand + для связи + phone + address + social iconlar
 *     grid (3×2, 56×56 kvadrat), 4 dona brand icon
 *   - O'ngda: 4 kolonka (Магазин / Клиенту / Помощь / Ташкент)
 *   - Ostda: copyright chizigi
 */

type Props = {
  phone: string;
  address: string;
  brand?: string;
};

const COLUMNS = [
  {
    title: "Магазин",
    links: ["О нас", "Каталог", "Коллекции", "Новинки", "Акции"],
  },
  {
    title: "Клиенту",
    links: ["Доставка", "Возврат", "Примерка", "AR-примерка"],
  },
  {
    title: "Помощь",
    links: ["FAQ", "Уход за ковром", "Гарантия", "Оплата"],
  },
];

const CONTACT_COLUMN = {
  title: "Ташкент",
  links: [
    { text: "+998 71 000-00-00", href: "tel:+998710000000" },
    { text: "info@elexus.uz", href: "mailto:info@elexus.uz" },
    { text: "Instagram", href: "https://instagram.com/elexus" },
    { text: "Telegram", href: "https://t.me/elexus" },
  ],
};

/* Social ikonlari — Figma 3×2 grid da (Rectangle 78-82) */
function SocialGrid() {
  const items = [
    { name: "instagram", path: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 3.5c1.5 0 5 .2 5 3.5h-3.5c-.3-.7-1-1.2-1.5-1.2s-1.2.5-1.5 1.2H7c0-3.3 3.5-3.5 5-3.5zm-5 5.5h10c0 3.5-1.5 5.5-5 5.5s-5-2-5-5.5z" },
    { name: "telegram", path: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.7 6.9l-1.6 7.5c-.1.5-.4.7-.9.4l-2.4-1.8-1.2 1.1c-.1.1-.2.2-.5.2l.2-2.5 4.5-4.1c.2-.2-.05-.3-.3-.1L9 12.9l-2.4-.7c-.5-.2-.5-.5.1-.7l9.6-3.7c.4-.15.8.1.4 1.1z" },
    { name: "facebook", path: "M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H8v-2.9h2.4V9.4c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.7l-.4 2.9h-2.3v7c4.7-.8 8.4-4.9 8.4-9.9 0-5.5-4.5-10-10-10z" },
    { name: "linkedin", path: "M20.4 2H3.6C2.7 2 2 2.7 2 3.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.6c0-.9-.7-1.6-1.6-1.6zM8 19H5V9h3v10zm-1.5-11.3c-1 0-1.7-.8-1.7-1.7s.8-1.7 1.7-1.7 1.7.8 1.7 1.7-.7 1.7-1.7 1.7zM19 19h-3v-5c0-1.2-.4-2-1.5-2s-1.5.7-1.5 2v5h-3V9h3v1.4c.5-.7 1.4-1.6 3-1.6 2.2 0 3 1.4 3 4V19z" },
    { name: "twitter", path: "M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.6.8-2.5 1-.7-.8-1.7-1.3-2.9-1.3-2.2 0-4 1.8-4 4 0 .3 0 .6.1.9-3.3-.2-6.3-1.7-8.3-4.1-.3.6-.5 1.3-.5 2 0 1.4.7 2.6 1.8 3.3-.7 0-1.3-.2-1.8-.5 0 2 1.4 3.6 3.2 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.1 1.7-5 1.7-.3 0-.7 0-1-.1 1.8 1.2 4 1.9 6.3 1.9 7.5 0 11.7-6.2 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" },
  ];
  return (
    <div className="grid grid-cols-3 gap-[4px]">
      {items.map((s, i) => (
        <a
          key={i}
          href={`#${s.name}`}
          aria-label={s.name}
          className="flex h-[56px] w-[56px] items-center justify-center rounded-[8px] bg-black/[0.04] text-black transition-colors hover:bg-black hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

export default function FooterElexus({ phone, address, brand = "Elexus Hali" }: Props) {
  return (
    <footer data-section="footer" className="w-full bg-white pb-[40px] pt-[80px]">
      <div className="mx-auto max-w-[1728px] px-[40px] sm:px-[60px] lg:px-[80px]">
        <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-[minmax(0,340px)_repeat(4,1fr)]">
          {/* Brand kolonka + social */}
          <div className="flex flex-col gap-[16px]">
            <h3 className="text-[32px] font-black uppercase tracking-tight text-black">
              {brand}
            </h3>
            <div className="flex flex-col gap-[6px]">
              <span className="text-[13px] text-black/60">для связи:</span>
              <span className="text-[24px] font-bold text-black">{phone}</span>
              <span className="text-[13px] font-medium text-black/80">
                {address}
              </span>
            </div>
            <SocialGrid />
          </div>

          {/* 3 ta link kolonkasi */}
          {COLUMNS.map((c, i) => (
            <div key={i} className="flex flex-col gap-[16px]">
              <h4 className="text-[18px] font-bold text-black">{c.title}</h4>
              <ul className="flex flex-col gap-[10px]">
                {c.links.map((l, j) => (
                  <li key={j}>
                    <Link
                      href={`/${l.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-[14px] text-black/70 hover:text-black"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kontakt kolonkasi */}
          <div className="flex flex-col gap-[16px]">
            <h4 className="text-[18px] font-bold text-black">
              {CONTACT_COLUMN.title}
            </h4>
            <ul className="flex flex-col gap-[10px]">
              {CONTACT_COLUMN.links.map((l, j) => (
                <li key={j}>
                  <a
                    href={l.href}
                    className="text-[14px] text-black/70 hover:text-black"
                  >
                    {l.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright chizigi */}
        <div className="mt-[60px] flex justify-start border-t border-black/10 pt-[24px]">
          <span className="text-[13px] text-black/60">
            © 2026 · Дом ковровых изделий
          </span>
        </div>
      </div>
    </footer>
  );
}
