import { Link } from "@/i18n/routing";
import { COMPANY, LEGAL_TEXTS, legalLocale } from "@/data/legal";

/** Firma nomi, manzil, STIR va kontaktlar — footer va yuridik sahifalar uchun. */
export function CompanyContacts({ locale }: { locale: string }) {
  const lang = legalLocale(locale);
  const t = LEGAL_TEXTS[lang].requisites;

  return (
    <div className="flex flex-col gap-1 text-[13px] leading-[20px] text-[#555]">
      <p className="font-semibold text-[#212121]">{COMPANY.name[lang]}</p>
      <p>{COMPANY.address[lang]}</p>
      <p>
        {t.stir}: {COMPANY.stir}
      </p>
      <p>
        {t.phone}:{" "}
        <a href={`tel:${COMPANY.phone}`} className="text-blue-600 hover:underline">
          {COMPANY.phoneDisplay}
        </a>
      </p>
      {COMPANY.email && (
        <p>
          {t.email}:{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-blue-600 hover:underline">
            {COMPANY.email}
          </a>
        </p>
      )}
    </div>
  );
}

/**
 * gilam-market.uz pastidagi rekvizitlar bloki. Pastki qism FixedLayout'ning
 * qotirilgan paneli (bottom-[20px]/[40px]) ostida qolmasligi uchun pb katta.
 */
export default function LegalRequisites({ locale }: { locale: string }) {
  const t = LEGAL_TEXTS[legalLocale(locale)].requisites;

  return (
    <footer className="w-full border-t border-[#eee] bg-white px-4 pb-[120px] pt-8 sm:px-[30px]">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 sm:flex-row">
        <CompanyContacts locale={locale} />
        <nav className="flex flex-col gap-1 text-[13px] leading-[20px]">
          <Link href="/privacy" className="text-[#212121] hover:underline">
            {t.privacy}
          </Link>
          <Link href="/data-deletion" className="text-[#212121] hover:underline">
            {t.dataDeletion}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
