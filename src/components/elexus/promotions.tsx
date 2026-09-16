"use client";

/**
 * "Акции и скидки" seksiyasi (Figma 333:734, 333:796, 333:802-822).
 *
 * Layout:
 *   - Chapda: sarlavha "Акции и скидки" + HERA LUXURY + opis + navigation
 *   - O'ngda: 3 karta 360×560 bilan "Скидка" gradient badge yuqori-o'ngda
 *   - Ostida: "Загрузить ещё" button 240×44
 */

const PROMOS = [
  { title: "Осенняя коллекция", discount: "-30%", img: "https://images.unsplash.com/photo-1618221639244-c1a8502c0eb9?auto=format&fit=crop&w=800&q=60" },
  { title: "Зимние скидки", discount: "-40%", img: "https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&w=800&q=60" },
  { title: "Новый год", discount: "-25%", img: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=60" },
];

export default function PromotionsSection() {
  return (
    <section data-section="promotions" className="w-full py-[80px]">
      <div className="mx-auto grid max-w-[1728px] grid-cols-1 gap-[40px] px-[40px] sm:px-[60px] lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:px-[80px]">
        {/* Chap */}
        <div className="flex flex-col gap-[24px]">
          <h2 className="text-[32px] font-black text-black sm:text-[39px]">
            Акции и скидки
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

        {/* O'ng: kartalar */}
        <div className="flex flex-col items-center gap-[24px]">
          <div className="grid w-full grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
            {PROMOS.map((p, i) => (
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
                {/* Скидка badge - gradient circle o'ng yuqorida */}
                <div className="absolute right-[16px] top-[16px] flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gradient-to-br from-[#F5B78F] to-[#D48258] text-[18px] font-bold text-white shadow-lg">
                  {p.discount}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-[20px]">
                  <span className="text-[18px] font-semibold text-white">{p.title}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Загрузить ещё button — Figma 240×44 */}
          <button
            type="button"
            className="inline-flex h-[44px] items-center justify-center rounded-[6px] border border-black bg-white px-[32px] text-[14px] font-semibold text-black transition-colors hover:bg-black hover:text-white"
            style={{ width: "240px" }}
          >
            Загрузить ещё
          </button>
        </div>
      </div>
    </section>
  );
}
