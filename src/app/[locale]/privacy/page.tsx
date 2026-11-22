import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InfoPageLayout from "../../../components/info-page-layout";
import { CompanyContacts } from "@/components/legal-requisites";
import { LEGAL_TEXTS, POLICY_UPDATED, legalLocale } from "@/data/legal";
import { getTenantShop } from "@/service/tenant-shop";
import type { MetadataProps, PageProps } from "@/types/next";
import { localizedAlternates } from "@/utils/metadata";

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
    const { locale } = await params;
    const t = LEGAL_TEXTS[legalLocale(locale)].privacy;
    return {
        title: t.title,
        description: t.description,
        alternates: localizedAlternates(locale, "/privacy"),
    };
}

export default async function PrivacyPage({ params }: PageProps) {
    const { locale } = await params;
    // Rekvizitlar Gilam Market'niki — tenant do'kon domenida ko'rsatilmaydi.
    if (await getTenantShop()) notFound();
    const t = LEGAL_TEXTS[legalLocale(locale)].privacy;

    return (
        <InfoPageLayout title={t.title.split(" - ")[0]}>
            <div className="flex flex-col gap-6 text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#212121]">
                <p className="text-[13px] text-[#777]">
                    {t.updated}: {POLICY_UPDATED}
                </p>
                <p>{t.intro}</p>
                {t.sections.map((s) => (
                    <section key={s.heading} className="flex flex-col gap-2">
                        <h2 className="text-[16px] md:text-[18px] font-semibold">{s.heading}</h2>
                        {s.paragraphs.map((p) => (
                            <p key={p}>{p}</p>
                        ))}
                    </section>
                ))}
                <CompanyContacts locale={locale} />
            </div>
        </InfoPageLayout>
    );
}
