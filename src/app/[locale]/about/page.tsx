import InfoPageLayout from "../../../components/info-page-layout";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { MetadataProps, PageProps } from "@/types/next";
import { localizedAlternates } from "@/utils/metadata";

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "About" });
    return {
        title: t("title"),
        description: t("description"),
        alternates: localizedAlternates(locale, "/about"),
    };
}

export default async function AboutPage({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "About" });

    return (
        <InfoPageLayout title={t("pageTitle")}>
            <div className="flex flex-col gap-6 text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#212121]">
                <p>{t("body1")}</p>
                <p className="font-medium">{t("categoriesTitle")}</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>{t("cat1")}</li>
                    <li>{t("cat2")}</li>
                    <li>{t("cat3")}</li>
                    <li>{t("cat4")}</li>
                </ul>
                <p>{t("body2")}</p>
                <p>{t("body3")}</p>
                <p>{t("body4")}</p>
                <p>{t("body5")}</p>
            </div>
        </InfoPageLayout>
    );
}
