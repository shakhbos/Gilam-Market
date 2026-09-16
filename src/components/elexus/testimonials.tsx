"use client";

/**
 * "Что говорят о нас" seksiyasi (Figma 333:735, 333:826-853).
 *
 * Layout:
 *   - Chapda: sarlavha "что говорят о нас" (78px height, 2 qatorli katta)
 *   - O'ngda: "Хотите оставить отзыв?" link + 3 ta karta 387×680
 *   - Har karta: mijoz nomi + "Наш клиент" + katta iqtibos + 220×220 rasm ostda
 */

const TESTIMONIALS = [
  {
    name: "Abbos Janizakov",
    role: "Наш клиент",
    quote:
      "«Очень довольна покупкой!» Ковёр оказался даже красивее, чем на фото. Качество отличное, цвет идеально подошёл к интерьеру. Спасибо за быструю доставку!",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Malika Rahimova",
    role: "Наш клиент",
    quote:
      "«Очень довольна покупкой!» Ковёр оказался даже красивее, чем на фото. Качество отличное, цвет идеально подошёл к интерьеру. Спасибо за быструю доставку!",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Behzod Karimov",
    role: "Наш клиент",
    quote:
      "«Очень довольна покупкой!» Ковёр оказался даже красивее, чем на фото. Качество отличное, цвет идеально подошёл к интерьеру. Спасибо за быструю доставку!",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  },
];

export default function TestimonialsSection() {
  return (
    <section data-section="testimonials" className="w-full bg-[#F9F7F4] py-[80px]">
      <div className="mx-auto grid max-w-[1728px] grid-cols-1 gap-[40px] px-[40px] sm:px-[60px] lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:px-[80px]">
        {/* Chap: sarlavha + link */}
        <div className="flex flex-col gap-[16px]">
          <h2
            className="text-black"
            style={{
              fontSize: "clamp(32px, 3.5vw, 56px)",
              fontWeight: 900,
              lineHeight: 1.05,
            }}
          >
            что говорят<br />о нас
          </h2>
          <a
            href="/reviews/new"
            className="inline-flex items-center gap-[8px] text-[15px] font-semibold text-black underline-offset-4 hover:underline"
          >
            Хотите оставить отзыв?
          </a>
        </div>

        {/* O'ng: 3 ta karta */}
        <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col rounded-[16px] bg-white p-[24px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)]"
              style={{ aspectRatio: "387 / 680" }}
            >
              {/* Header: name + role */}
              <div className="mb-[8px] flex flex-col gap-[2px]">
                <span className="text-[22px] font-bold text-black">{t.name}</span>
                <span className="text-[12px] text-black/60">{t.role}</span>
              </div>

              {/* Katta iqtibos belgisi */}
              <span className="mb-[8px] text-[56px] leading-none text-[#D48258]">
                &ldquo;
              </span>

              {/* Iqtibos matni */}
              <p className="mb-auto text-[14px] leading-[1.5] text-black/80">
                {t.quote}
              </p>

              {/* Ostda: 220×220 kvadrat rasm */}
              <div
                className="mt-[16px] overflow-hidden rounded-[12px] bg-[#F4F4F4]"
                style={{ aspectRatio: "1 / 1" }}
              >
                <img
                  src={t.img}
                  alt={t.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
