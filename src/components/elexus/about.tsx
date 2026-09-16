"use client";

/**
 * "Мы ради работать в вашем уюте" seksiyasi (Figma 333:794, 333:784, 333:793).
 *
 * Layout:
 *   - Chapda: sarlavha "Мы ради работать в вашем уюте" (78px height, ~48px font)
 *   - Markazda va o'ngda: 2 ta paragraph katta (520×200 va 520×160)
 */

export default function AboutSection() {
  return (
    <section data-section="about" className="w-full py-[80px]">
      <div className="mx-auto grid max-w-[1728px] grid-cols-1 gap-[40px] px-[40px] sm:px-[60px] lg:grid-cols-3 lg:px-[80px]">
        {/* Chap: sarlavha */}
        <h2
          className="text-black"
          style={{
            fontSize: "clamp(32px, 3vw, 48px)",
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: "320px",
          }}
        >
          Мы ради работать в вашем уюте
        </h2>

        {/* O'rta: 1-paragraf */}
        <p className="text-[15px] leading-[1.6] text-black/70 sm:text-[16px]">
          Добро пожаловать в наш магазин ковровых изделий! Мы предлагаем
          широкий ассортимент современных и классических ковров, дорожек и
          ковровых покрытий, которые помогут создать уют и подчеркнуть стиль
          вашего дома, офиса или любого другого пространства.
        </p>

        {/* O'ng: 2-paragraf */}
        <p className="text-[15px] leading-[1.6] text-black/70 sm:text-[16px]">
          Мы предлагаем широкий ассортимент современных и классических ковров,
          дорожек и ковровых покрытий, которые помогут создать уют и
          подчеркнуть стиль вашего дома, офиса или любого другого пространства.
        </p>
      </div>
    </section>
  );
}
