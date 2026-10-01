import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react";

import Container from "./container";
import { Link } from "@/i18n/routing";

/*
 * Elexus — Footer.
 * Figma frame 100:281, y=5930..6169. Bolalar bitta wrapping frame'ga
 * yig'ilmagan — brend bloki, ijtimoiy tarmoq to'ri va 4 ustun Frame 15 ning
 * to'g'ridan-to'g'ri farzandlari (100:380..429).
 * ═════════════════════════════════════════════════════════════════════════
 * 12-KOLONKA GRID (sahifaning boshqa hamma seksiyasi bilan bir xil tizim —
 * Container > grid-cols-12, shu bilan responsiveness ham bepul keladi):
 *   Brend bloki (logo + kontakt)   col-start-1, col-span-2
 *   Qolgan hammasi (ijtimoiy to'r
 *   + 4 ustun)                     col-start-4, col-span-9
 *
 *   Ikkalasi ham mobil/tablet'da col-span-12 ga tushib ustma-ust oqadi —
 *   alohida "mobil versiya" JSX YO'Q, xuddi shu bitta grid breakpoint bilan
 *   javob beradi (ProductsSection/StylesSection kabi).
 *
 * col-4 ICHIDAGI joylashuv (Figma piksellari, kontent chetiga nisbatan,
 * ya'ni Figma x − 100 − 433.5 [c4 boshlanishi]):
 *   Ijtimoiy to'r   0    (100:416 Rectangle 89 x=534 ≈ c4=433.5 — deyarli
 *                   aynan, header/hero bilan bir xil grid'ga tushadi)
 *   Магазин         ~244 (678−434)
 *   Клиенту         ~444 (878−434)
 *   Помощь          ~644 (1078−434)
 *   Ташкент         ~844 (1278−434)
 *
 *   Ijtimoiy to'r → Магазин oralig'i 68px, keyingi uchtasi orasida esa aynan
 *   100px (barchasi o'lchangan, piksel darajasida tekshirilgan). Bu qator
 *   12-kolonka grid'iga tushmaydi (About seksiyasidagi kabi — Figma'da bu
 *   qismga mobil freym ham yo'q), shuning uchun col-4 ICHIDA flex + aniq
 *   gap qiymatlari ishlatiladi, faqat TASHQI joylashuv (col-4) grid'ga
 *   bog'langan.
 *
 * IJTIMOIY TARMOQ — 5 TA, 6 EMAS:
 *   Figma'da Rectangle 89/90/91/82/92 — besh dona 56×56 katak, 4px oraliq,
 *   3 tadan qatorga (3+2) o'raladi; olтinchi "bo'sh katak" degan narsa YO'Q,
 *   shunchaki 5-element 2-qatorga o'tadi. Shuning uchun grid-rows-2 + soxta
 *   bo'sh <span> emas — `flex flex-wrap` qat'iy 176px (=56×3+4×2) kenglikda,
 *   5-element o'zi tabiiy ravishda ikkinchi qatorga o'raladi.
 *
 * Y (barchasi qator tepasidan, y=5930):
 *   Brend/ijtimoiy to'r/ustun sarlavhalari — offset 0 (bir chiziqda).
 *   Ustun HAVOLALARI — offset 36 (y=5966−5930): sarlavha (h=21, 14px/1.5)
 *   + 15px oraliq (5966−5951).
 *   Havolalar orasi 7px (24−17, matn 14px/normal ≈ h=17).
 *
 *   Brend bloki ichida (Elexus/"для связи:"/telefon/manzil) bbox'lar deyarli
 *   TEGIB turadi (masalan для связи: y=5969 = Elexus tugashi 5930+39=5969,
 *   aynan 0px) — shuning uchun oraliqsiz (`gap` yo'q), faqat shrift oqimi.
 *
 *   © qatori y=6111 — Магазин ustuni tugashidan (5930+21+15+5×17+4×7=6079)
 *   32px past.
 */

type NavLink = { label: string; href: string };
type NavColumn = { heading: string; links: readonly NavLink[] };

const NAV_COLUMNS: readonly NavColumn[] = [
  {
    heading: "Магазин",
    links: [
      { label: "О нас", href: "/about" },
      { label: "Каталог", href: "/catalog" },
      { label: "Коллекции", href: "/catalog" },
      { label: "Новинки", href: "/catalog" },
      { label: "Акции", href: "/catalog" },
    ],
  },
  {
    heading: "Клиенту",
    links: [
      { label: "Доставка", href: "/delivery" },
      { label: "Возврат", href: "#" },
      { label: "Примерка", href: "#" },
      { label: "AR-примерка", href: "#ar" },
    ],
  },
  {
    heading: "Помощь",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Уход за ковром", href: "#" },
      { label: "Гарантия", href: "#" },
      { label: "Оплата", href: "/payment" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Telegram", href: "#", Icon: Send },
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Twitter", href: "#", Icon: Twitter },
] as const;

/** Sarlavha — Figma: 14px/1.5, #7E7C78, UPPERCASE. */
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[14px] uppercase leading-[1.5] text-[#7E7C78]">
      {children}
    </h3>
  );
}

function BrandBlock() {
  return (
    <div className="flex flex-col" data-node-id="100:380">
      <Link
        href="/"
        className="text-[32px] font-semibold leading-none tracking-[-0.96px] text-black"
      >
        Elexus
      </Link>
      <div>
        <p className="text-[14px] uppercase leading-[1.5] text-[#7E7C78]" data-node-id="100:407">
          для связи:
        </p>
        <a
          href="tel:+998900123456"
          className="block text-[28px] font-semibold leading-[1.2] text-black transition-opacity duration-150 hover:opacity-70"
          data-node-id="100:406"
        >
          90 123 45 67
        </a>
      </div>
      <p className="max-w-[232px] text-[14px] leading-[1.5] text-[#7E7C78]" data-node-id="100:409">
        Uzbekistan, Tashkent, Aloqa, street 28
      </p>
    </div>
  );
}

/** 5 ta ikonka, 56px katak, 4px oraliq, 176px kenglikda 3+2 bo'lib o'raladi. */
function SocialGrid() {
  return (
    <div className="flex w-[176px] flex-wrap gap-1" data-node-id="100:416">
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="flex size-14 shrink-0 items-center justify-center bg-white text-[#222] transition-opacity duration-150 hover:opacity-60"
        >
          <Icon size={20} strokeWidth={1.5} />
        </a>
      ))}
    </div>
  );
}

/**
 * Figma'da har ustun 100px'lik QAT'IY freym (Frame32/33/34/35 width=100) —
 * matn undan uzun bo'lsa ham (masalan telefon raqami 124px) freym kengligi
 * o'zgarmaydi, matn shunchaki bir qatorda tashqariga chiqadi. Keyingi ustun
 * shu 100px'dan SO'NG яна 100px gap bilan boshlanadi (jami qadam 200px) —
 * shuning uchun bu yerda ham qat'iy `w-[100px]` + `whitespace-nowrap`,
 * "hug content" emas — aks holda qisqa so'zli ustunlar torayib, keyingi
 * ustunni chapga suradi va qadam Figma'dagi 200px'dan og'ib ketadi.
 */
function NavColumnBlock({ col }: { col: NavColumn }) {
  return (
    <div className="flex w-[100px] shrink-0 flex-col gap-[15px]">
      <ColumnHeading>{col.heading}</ColumnHeading>
      <ul className="flex flex-col gap-[7px]">
        {col.links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="whitespace-nowrap text-[14px] leading-[normal] text-[#222] transition-opacity duration-150 hover:opacity-60"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Ташкент" — shahar nomi sarlavha, ostida kontakt havolalari. */
function ContactColumn() {
  return (
    <div className="flex w-[100px] shrink-0 flex-col gap-[15px]" data-node-id="100:393">
      <ColumnHeading>Ташкент</ColumnHeading>
      <ul className="flex flex-col gap-[7px] whitespace-nowrap text-[14px] leading-[normal] text-[#222]">
        <li>
          <a href="tel:+998710000000" className="transition-opacity duration-150 hover:opacity-60">
            +998 71 000-00-00
          </a>
        </li>
        <li>
          <a href="mailto:info@elexus.uz" className="transition-opacity duration-150 hover:opacity-60">
            info@elexus.uz
          </a>
        </li>
        <li>
          <a href="#" className="transition-opacity duration-150 hover:opacity-60">
            Instagram
          </a>
        </li>
        <li>
          <a href="#" className="transition-opacity duration-150 hover:opacity-60">
            Telegram
          </a>
        </li>
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      className="w-full bg-[#F4EFE9] pb-10 pt-[100px]"
      style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
    >
      <Container>
        <div className="grid grid-cols-12 gap-x-[14px] gap-y-10">
          {/* Brend — col 1-2. */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2 lg:col-start-1">
            <BrandBlock />
          </div>

          {/* Ijtimoiy to'r + 4 ustun — col 4-12. Ichkarida flex + aniq
                oraliqlar (68px ijtimoiy→Магазин, 100px har bir ustun
                orasida — o'lchangan qiymatlar, grid'ga tushmaydi). */}
          <div className="col-span-12 lg:col-span-9 lg:col-start-4">
            <div className="flex flex-wrap gap-x-[68px] gap-y-10">
              <SocialGrid />
              <div className="flex flex-wrap gap-x-[100px] gap-y-10">
                {NAV_COLUMNS.map((col) => (
                  <NavColumnBlock key={col.heading} col={col} />
                ))}
                <ContactColumn />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-[14px] leading-[1.5] text-[#7E7C78]" data-node-id="100:408">
          © {new Date().getFullYear()} · Дом ковровых изделий
        </p>
      </Container>
    </footer>
  );
}
