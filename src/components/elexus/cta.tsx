"use client";

/**
 * CTA seksiyasi (Figma 333:828, 333:864, 333:865).
 *
 * Layout:
 *   - Katta gorizontal band 1161×200 fon rasmi (Rectangle 83)
 *   - O'ng qirrasi: dekorativ chiziqlar (10/20/40/80 keng)
 *   - Ustida: "Подарите интерьеру особенный характер" sarlavhasi
 *     + opis matn
 */

export default function CtaSection() {
  return (
    <section data-section="cta" className="w-full py-[80px]">
      <div className="mx-auto max-w-[1728px] px-[40px] sm:px-[60px] lg:px-[80px]">
        <div className="relative overflow-hidden rounded-[16px]">
          {/* Fon rasm */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 100%), url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=70')",
            }}
          />

          {/* Dekorativ chiziqlar o'ng qirrasida — Figma Rectangle 85/86/87/88 */}
          <div className="absolute right-0 top-0 hidden h-full items-stretch gap-[6px] pr-[20px] lg:flex">
            <span className="my-[16px] w-[10px] rounded-full bg-white/40" />
            <span className="my-[16px] w-[20px] rounded-full bg-white/50" />
            <span className="my-[16px] w-[40px] rounded-full bg-white/60" />
            <span className="my-[16px] w-[80px] rounded-full bg-white/80" />
          </div>

          {/* Content — Figma Rectangle 83 = 1161×200, matn chapdan boshlaydi */}
          <div className="relative z-10 flex flex-col gap-[16px] px-[40px] py-[40px] sm:px-[60px] sm:py-[56px] lg:pr-[220px]">
            <h2
              className="font-black text-white"
              style={{
                fontSize: "clamp(24px, 2.5vw, 39px)",
                lineHeight: 1.1,
                maxWidth: "700px",
              }}
            >
              Подарите интерьеру особенный характер
            </h2>
            <p
              className="text-white/90"
              style={{
                fontSize: "clamp(14px, 1.2vw, 18px)",
                lineHeight: 1.5,
                maxWidth: "560px",
              }}
            >
              Выберите ковёр, который подчеркнёт стиль вашего дома и создаст
              атмосферу настоящего уюта.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
