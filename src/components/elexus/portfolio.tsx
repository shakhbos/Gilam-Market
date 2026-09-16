"use client";

/**
 * "Наше портфолио" seksiyasi (Figma 333:797, 333:798).
 *
 * Layout:
 *   - Sarlavha: "Наше портфолио" (39px bold)
 *   - Katta panoramic rasm: 1608×600 (butun kontent kengligi)
 */

export default function PortfolioSection() {
  return (
    <section data-section="portfolio" className="w-full py-[60px]">
      <div className="mx-auto max-w-[1728px] px-[40px] sm:px-[60px] lg:px-[80px]">
        <h2 className="mb-[24px] text-[32px] font-black tracking-tight text-black sm:text-[39px]">
          Наше портфолио
        </h2>
        <div
          className="w-full overflow-hidden rounded-[12px] bg-[#F4F4F4]"
          style={{ aspectRatio: "1608 / 600", maxHeight: "600px" }}
        >
          <img
            src="https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=2400&q=70"
            alt="Portfolio panorama"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
