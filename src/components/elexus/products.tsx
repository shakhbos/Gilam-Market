"use client";

/**
 * "ПРОДУКТЫ / HERA LUXURY" seksiyasi (Figma 333:733, 333:795, 333:799-801).
 *
 * Layout:
 *   - Chapda: sarlavha ПРОДУКТЫ (39px) + HERA LUXURY subtitle (39px) + 289×100 opis matn + chevron kontrol
 *   - O'ngda: 3 ta karta 360×560 (product) + "Посмотреть все коллекции" link
 */

const PRODUCTS = [
  { title: "HERA Luxury", img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=60" },
  { title: "HERA Silver", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=60" },
  { title: "HERA Gold", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=60" },
];

export default function ProductsSection() {
  return (
    <section data-section="products" className="w-full py-[80px]">
      <div className="mx-auto grid max-w-[1728px] grid-cols-1 gap-[40px] px-[40px] sm:px-[60px] lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:px-[80px]">
        {/* Chap panel: sarlavha + opis + navigation */}
        <div className="flex flex-col gap-[24px]">
          <h2 className="text-[32px] font-black text-black sm:text-[39px]">
            ПРОДУКТЫ
          </h2>
          <h3 className="text-[24px] font-bold text-black sm:text-[32px]">
            HERA LUXURY
          </h3>
          <p className="text-[15px] leading-[1.5] text-black/70">
            Мы предлагаем широкий ассортимент современных и классических ковров,
            дорожек и ковровых покрытий, которые помогут создать уют и подчеркнуть
            стиль
          </p>
          <div className="flex gap-[8px]">
            <button
              type="button"
              aria-label="Previous"
              className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-black/20 hover:bg-black hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-black/20 hover:bg-black hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* O'ng: 3 ta karta + link */}
        <div className="flex flex-col gap-[24px]">
          <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-[12px] bg-[#F4F4F4]"
                style={{ aspectRatio: "360 / 560" }}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-[20px]">
                  <span className="text-[18px] font-semibold text-white">{p.title}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-start">
            <a
              href="/products"
              className="inline-flex items-center gap-[8px] text-[15px] font-semibold text-black underline-offset-4 hover:underline"
            >
              Посмотреть все коллекции
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
