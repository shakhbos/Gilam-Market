"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";

const CATEGORIES = [
    { key: "categoryLivingRoom", value: "living_room" },
    { key: "categoryBedroom", value: "bedroom" },
    { key: "categoryKids", value: "kids" },
    { key: "categoryKitchen", value: "kitchen" },
    { key: "categoryHallway", value: "hallway" },
    { key: "categoryOffice", value: "office" },
    { key: "categoryCabinet", value: "cabinet" },
    { key: "categoryStairs", value: "stairs" },
    { key: "categoryOutdoor", value: "outdoor" },
] as const;

export default function Menu() {
    const t = useTranslations("Menu");

    return (
        <div className="w-full bg-white pb-5">
            <div className="flex flex-col gap-8 pl-5 md:pl-14 pr-5 px-4 justify-between">
                <div className="flex flex-col w-full">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.svg"
                                alt="Gilam Market Details"
                                width={100}
                                height={50}
                                className="object-contain"
                            />
                            <div>
                                <h3 className="text-lg text-sm text-[#333]">OOO Gilam Market</h3>
                                <p className="text-sm text-gray-500">{t("companyTagline")}</p>
                            </div>
                        </div>

                        <nav className="flex flex-wrap gap-4 md:gap-8 text-[16px] font-medium text-[#333]">
                            <Link href="/about">{t("aboutLink")}</Link>
                            <Link href="/delivery">{t("deliveryLink")}</Link>
                            <Link href="/payment">{t("paymentLink")}</Link>
                        </nav>
                    </div>

                    <div className="flex flex-wrap gap-4 my-[45px] md:gap-8">
                        {CATEGORIES.map((item) => (
                            <Link
                                key={item.value}
                                href={`/?category=${item.value}`}
                                className="text-[15px] text-[#333] hover:text-black hover:underline transition-colors"
                            >
                                {t(item.key)}
                            </Link>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-[#333]">{t("contactsTitle")}</h4>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">{t("addressLabel")}</p>
                                <p className="text-sm font-medium text-[#333]">
                                    {t("addressValue")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">{t("phoneLabel")}</p>
                                <a
                                    href="tel:+998946093444"
                                    className="text-sm font-medium text-[#333]"
                                >
                                    +998 94 609-34-44
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
