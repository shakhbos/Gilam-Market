import ElexusHeader from "@/components/elexus/header";
import HeroElexus from "@/components/elexus/hero";
import type { TenantShop } from "@/service/tenant-shop";

/**
 * Elexus Hali home page — tenant maxsus dizayni (Figma: 256:1490).
 *
 * Bosqichma-bosqich implement qilinadi. Hozir skeleton (12 seksiya placeholder)
 * — keyingi commit'larda Header → Hero → USLUBLAR → ... to'ldiriladi.
 *
 * Ma'lumot manbai: hozircha statik demo (Figma matni), keyin backend
 * `/shop-product`, `/shop-banner`, `/shop-promotion` API'lariga bog'lanadi.
 */
type Props = {
  shop: TenantShop;
};

export default function HomeElexus({ shop }: Props) {
  const brand = shop.title || "Elexus Hali";
  const phone = shop.phone || "90 123 45 67";
  const address = shop.address || "Uzbekistan, Tashkent, Aloqa, street 28";

  return (
    <div className="bg-white text-[#171717] antialiased" data-tenant={shop.slug}>
      {/* 1. Header — top navbar */}
      <ElexusHeader shop={shop} />


      {/* 2. Hero — scroll-linked expand effekti (waabi.ai uslubi teskarisi) */}
      <HeroElexus phone={phone} address={address} />

      {/* 3. USLUBLAR karusel */}
      <section data-section="uslublar" className="px-[60px] py-16 text-center text-[#B0B0B0]">
        USLUBLAR (keyingi commit)
      </section>

      {/* 4. МЫ РАДЫ РАБОТАТЬ — 2 kolonka matn */}
      <section data-section="about" className="px-[60px] py-16 text-center text-[#B0B0B0]">
        МЫ РАДЫ РАБОТАТЬ (keyingi commit)
      </section>

      {/* 5. Portfolio panorama */}
      <section data-section="portfolio" className="px-[60px] py-16 text-center text-[#B0B0B0]">
        PORTFOLIO (keyingi commit)
      </section>

      {/* 6. ПРОДУКТЫ — 3 karta + Загрузить ещё */}
      <section data-section="products" className="px-[60px] py-16 text-center text-[#B0B0B0]">
        ПРОДУКТЫ (keyingi commit)
      </section>

      {/* 7. АКЦИИ И СКИДКИ — 3 karta + ribbon */}
      <section data-section="promotions" className="px-[60px] py-16 text-center text-[#B0B0B0]">
        АКЦИИ И СКИДКИ (keyingi commit)
      </section>

      {/* 8. ЧТО ГОВОРЯТ О НАС — 3 testimonial */}
      <section data-section="testimonials" className="px-[60px] py-16 text-center text-[#B0B0B0]">
        ЧТО ГОВОРЯТ О НАС (keyingi commit)
      </section>

      {/* 9. CTA + social icons */}
      <section data-section="cta" className="px-[60px] py-16 text-center text-[#B0B0B0]">
        CTA (keyingi commit)
      </section>

      {/* 10. Footer — 4 kolonka + kontakt */}
      <footer data-section="footer" className="px-[60px] py-16 text-[#B0B0B0]">
        <div className="mx-auto flex max-w-[1920px] flex-col gap-2">
          <span className="text-[24px] font-bold text-[#171717]">{phone}</span>
          <span className="text-[15px] font-semibold text-[#171717]">{address}</span>
          <span className="text-[13px]">© 2026 · Дом ковровых изделий · {brand}</span>
        </div>
      </footer>
    </div>
  );
}
