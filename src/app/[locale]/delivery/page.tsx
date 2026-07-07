import InfoPageLayout from "../../../components/info-page-layout";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { MetadataProps, PageProps } from "@/types/next";
import { localizedAlternates } from "@/utils/metadata";

const CONTACT_TEL = "+998946093444";
const CONTACT_TEL_DISPLAY = "+998 94 609 34 44";

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Delivery" });
    return {
        title: t("title"),
        description: t("description"),
        alternates: localizedAlternates(locale, "/delivery"),
    };
}

export default async function DeliveryPage({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Delivery" });

    return (
        <InfoPageLayout title={t("pageTitle")}>
            <div className="flex flex-col gap-6 text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#212121]">
                <p>{t("body1")}</p>
                <p>{t("body2")}</p>
                <p>
                    {t("body3Prefix")}{" "}
                    <a href={`tel:${CONTACT_TEL}`} className="text-blue-600 hover:underline">
                        {CONTACT_TEL_DISPLAY}
                    </a>
                    .
                </p>
                <p>{t("body4")}</p>
                <p>{t("body5")}</p>
                <p>{t("body6")}</p>
            </div>
        </InfoPageLayout>
    );
}
