import Container from "./container";
import HeroShowcase, { type HeroSlide } from "./hero-showcase";

/*
 * Elexus Hero — asosiy sarlavha + undan keyingi showcase bloki.
 * Figma frame 100:281, node 200:2508 (Frame 50).
 * ─────────────────────────────────────────────────────────────────────────
 * FIGMA O'LCHAMLARI (1920px freym, kontent 1720px, chekka margin 100px):
 *   Frame 50   x=100  y=100  w=894  h=144
 *     satr 1   "Плотность важнее рисунка. Миллион"        h=48  o'ngga tekis
 *     satr 2   "узлов на метре держат линию так, как не"  h=48  chapga
 *     satr 3   "удержит печать."                          h=48  chapga
 *
 *   x=100 → kontentga nisbatan 0 → grid'ning 1-KOLONKASI (header logosi
 *   bilan bir chiziqda). Shuning uchun blok `col-start-1`.
 *   y=100 → header bar y=20..80 da tugaydi, ya'ni undan aynan 20px pastda.
 *
 * KENGLIK — HARDCODE EMAS, MATNDAN (auto-layout "hug"):
 *   894px sehrli raqam emas: bu 2-satrning 40px Inter Tight Medium'dagi
 *   tabiiy kengligi (o'lchandi: 893px). Shuning uchun konteyner `w-fit` —
 *   eng keng satr (2-satr) kenglikni belgilaydi, qolgan ikkitasi flex'ning
 *   `stretch`i bilan o'sha kenglikka cho'ziladi.
 *
 * ZINAPOYA (Figma: 1-satr o'ngga, 2 va 3 chapga):
 *   Uchalasi bir xil kenglikda bo'lgani uchun
 *     1-satr  → 2-satrga O'NGDAN tekislanadi (text-right)
 *     3-satr  → 2-satrga CHAPDAN tekislanadi (text-left)
 *   Ya'ni 2-satr — mos yozuvlar nuqtasi.
 *
 * TIPOGRAFIYA:
 *   Inter Tight Medium (500) · 40px · #e0caab · UPPERCASE
 *   Har satr 48px → leading 48/40 = 1.2 (3 × 48 = 144px).
 *
 * RESPONSIV:
 *   Shrift 40px va fluid shkalasi YO'Q — `w-fit` = min(max-content, mavjud
 *   joy), shuning uchun kontent 2-satr kengligidan (≈893px) keng bo'lguncha
 *   hech narsa o'ralmaydi ham, kichraymaydi ham — bu viewport ≥ ~934px.
 *   Undan tor ekranda quti mavjud joyga qisqaradi va satrlar o'raladi.
 *
 *   Yagona istisno: viewport < 440px da shrift 40px → 36px
 *   (`max-[439.98px]:text-[36px]`). .98 — kasrli viewport kengliklarida
 *   440px chegarasida bo'shliq qolmasligi uchun.
 */

/** Figma satrlari — alohida text node'lar, tartibi va tekislanishi bilan. */
const LINES = [
  { text: "Плотность важнее рисунка. Миллион", align: "text-right" },
  { text: "узлов на метре держат линию так, как не", align: "text-left" },
  { text: "удержит печать.", align: "text-left" },
] as const;

/*
 * DEMO ma'lumot — hozircha hero uchun API yo'q.
 * 1-slaydning `specs`lari Figma Frame 51 dan (200:2509…2512), rasmlar ham
 * Figma'dan yuklab olingan. Backend tayyor bo'lgach shu massiv props orqali
 * almashtiriladi — komponent butunlay ma'lumotga asoslangan.
 *
 * 2-slaydda `author` bor: Figma karuselida aynan shu thumbnail doira
 * ko'rinishida (image 4, 100:289) — ya'ni sharh muallifi slaydi.
 * Uning `video`si yo'q, shuning uchun demo'da ovoz tugmasi chiqmaydi;
 * `author.video` berilgan zahoti hover'da paydo bo'ladi.
 */
const DEMO_SLIDES: readonly HeroSlide[] = [
  {
    // 1-slaydda avatar bor: orqa fon Figma'ning "Rectangle 60" rasmi,
    // avatar esa Figma'ning dumaloq "image 4" rasmi — ikkalasi ham Figma'dan,
    // lekin turli rasm (bitta rasm ikki joyda takrorlanmasin).
    id: "review",
    // Description — Figma Frame 51 (200:2509…2512).
    specs: [
      "1 000 000 узлов на м²",
      "Ворс 12 мм; шерсть корк и шёлк",
      "Двойной персидский узел",
      "Иран",
    ],
    thumb: "/elexus/carpet-1.png",
    // Banner va avatar — Figma media zonasidan (x=537 y=258, 1282×591).
    media: {
      kind: "image",
      src: "/elexus/hero-banner.png",
      alt: "Elexus gilam salonи",
    },
    author: {
      name: "Обзор от эксперта",
      image: "/elexus/avatar-review.png",
      // Figma'dagi aniq kadr: manba to'liq bo'y surat, doirada faqat yuz
      // ko'rinishi uchun zumlangan (node 100:315 transformi).
      imageCrop: {
        width: "364.93%",
        height: "405.38%",
        left: "-161.95%",
        top: "-87.31%",
      },
    },
  },
  {
    id: "tabriz",
    specs: [
      "Отзыв клиента",
      "Тебриз 60 радж",
      "Выбран дома при своём свете",
      "Тошкент",
    ],
    thumb: "/elexus/carpet-2.png",
    media: { kind: "image", src: "/elexus/carpet-2.png", alt: "Tabriz gilami" },
  },
  {
    id: "aspendos",
    specs: [
      "700 000 узлов на м²",
      "Ворс 9 мм; шерсть",
      "Турецкий узел",
      "Кайсери",
    ],
    thumb: "/elexus/carpet-3.png",
    media: { kind: "image", src: "/elexus/carpet-3.png", alt: "Aspendos gilami" },
  },
  {
    id: "hera",
    specs: [
      "500 000 узлов на м²",
      "Ворс 10 мм; шерсть и вискоза",
      "Плоское плетение",
      "Хива",
    ],
    thumb: "/elexus/carpet-4.png",
    media: { kind: "image", src: "/elexus/carpet-4.png", alt: "Hera gilami" },
  },
];

export default function Hero({
  slides = DEMO_SLIDES,
}: {
  slides?: readonly HeroSlide[];
}) {
  // Balandlik kontent bo'yicha (min-h yo'q), pastdan 80px padding — shunda
  // keyingi seksiya hero ostidan ko'rinib turadi. Yuqoridagi 20px esa
  // Figma'dagi header↔title masofasi (y=80 → y=100).
  return (
    <section className="w-full pb-20 pt-5" data-node-id="200:2508">
      <Container>
        <div className="grid grid-cols-12 gap-x-[14px]">
          {/* col-start-1 → Figma'dagi x=100 (kontent chap cheti, logo bilan bir
                chiziqda). w-fit → kenglikni 2-satrning o'zi belgilaydi.
                Bitta <h1>: mazmunan yaxlit gap, screen reader uni uch alohida
                paragraf emas, bitta sarlavha sifatida o'qiydi. */}
          <h1
            className="col-span-12 col-start-1 flex w-fit flex-col justify-self-start text-[40px] uppercase leading-[1.2] text-[#e0caab] max-[439.98px]:text-[36px]"
            style={{
              fontFamily: "var(--font-inter-tight), Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            {LINES.map(({ text, align }) => (
              // flex-col'ning `stretch`i tufayli har satr konteyner kengligiga
              // cho'ziladi — shuning uchun text-align ishlaydi.
              <span key={text} className={align}>
                {text}
              </span>
            ))}
          </h1>
        </div>

        {/* Title'dan 14px pastdagi blok: chapda description + karusel +
              arrowlar (col-1→col-2), o'ngda media zonasi (col-3→col-12). */}
        <HeroShowcase slides={slides} />
      </Container>
    </section>
  );
}
