"use client";

/**
 * USLUBLAR seksiyasi (Figma 333:732 va 333:713-717 kartalar).
 *
 * Layout:
 *   - Sarlavha: USLUBLAR (39px bold)
 *   - Subtitle: "Выберите стиль вашего дома" (23px, gray)
 *   - Karusel: 5 karta (441×269 Figma) + navigation arrows
 *   - Karta ostidagi label: Евро ремонт / Борокко / Classik / Швейцарский
 *   - O'ngda: СЛЕД / ПРЕД (previous/next kontrol)
 *
 * Hozircha statik ko'rinish. Backend integratsiyasi keyinroq
 * (/shop-style yoki shu kabi endpoint).
 */

const STYLES = [
  { title: "Евро ремонт", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=60" },
  { title: "Барокко", img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=60" },
  { title: "Классик", img: "https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&w=800&q=60" },
  { title: "Швейцарский", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=60" },
  { title: "Швейцарский", img: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=60" },
];

export default function UslublarSection() {
  return (
    <section data-section="uslublar" className="w-full py-[80px]">
      <div className="mx-auto max-w-[1728px] px-[40px] sm:px-[60px] lg:px-[80px]">
        {/* Sarlavha qatori: USLUBLAR + subtitle + ПРЕД/СЛЕД */}
        <div className="mb-[24px] flex items-end justify-between gap-[24px]">
          <div className="flex items-baseline gap-[24px]">
            <h2 className="text-[32px] font-black uppercase tracking-tight text-black sm:text-[39px]">
              USLUBLAR
            </h2>
            <p className="text-[15px] text-black/70 sm:text-[16px]">
              Выберите стиль вашего дома
            </p>
          </div>
          <div className="flex items-center gap-[16px] text-[15px] font-semibold uppercase text-black/70">
            <button type="button" className="hover:text-black">ПРЕД</button>
            <span className="h-4 w-px bg-black/30" />
            <button type="button" className="hover:text-black">СЛЕД</button>
          </div>
        </div>

        {/* Karusel — 5 karta 441×269 */}
        <div className="flex gap-[12px] overflow-x-auto scroll-smooth pb-[8px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STYLES.map((s, i) => (
            <div key={i} className="flex shrink-0 flex-col gap-[16px]">
              <div
                className="overflow-hidden rounded-[8px] bg-[#F4F4F4]"
                style={{ width: "441px", height: "269px" }}
              >
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <span className="text-[15px] font-semibold text-black">{s.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
