/*
 * Elexus — sahifaning yagona konteyneri.
 * ─────────────────────────────────────────────────────────────────────────
 * Figma: freym 1920px, chekka margin 100px → KONTENT ENI 1720px.
 *
 * `max-w-[1920px]` + UZLUKSIZ chekka padding:
 *   clamp(20px, 5.2288vw − 0.392px, 100px)
 *     390px  ekranda → 20px
 *     1920px ekranda → 100px  (Figma qiymati) · kontent roppa-rosa 1720px
 *     ≥1920px        → 100px da to'xtaydi
 *
 * Nega pog'onali (`md:px-10 lg:px-[60px]`) emas: har breakpoint'da kontent
 * eni birdan 40px sakrardi va header'ning "40px ga yaqinlashganda yashirish"
 * qoidasi shu sakrashda buzilardi — 768px'da «Вызвать специалиста» yo'qolib,
 * 795px'da qaytib kelardi (o'lchangan). Uzluksiz formula bu sinf xatolarni
 * butunlay yo'q qiladi.
 *
 * Nega qat'iy `max-w-[1760px] px-5` ham emas: unda 1760px'dan tor ekranlarda
 * chekka 20px'ga tushib, kontent ekran chetiga yopishib qolardi —
 * 1440px'lik noutbukda "container yo'qdek" ko'rinardi.
 *
 * Avval har seksiyada `max-w-[1720px] px-5` takrorlanardi — u kontentni
 * 1680px qilib qo'yardi (padding max-w ICHIDA edi), ya'ni Figma'dan 40px
 * tor. Endi kenglik bir joyda belgilanadi.
 */

export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1920px] px-[clamp(20px,calc(5.2288vw_-_0.392px),100px)] ${className}`}
    >
      {children}
    </div>
  );
}
