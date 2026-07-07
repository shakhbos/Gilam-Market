"use client";
import React from "react";
import Image from "next/image";
import { Link } from "../i18n/routing";

const filters = {
    category: [
        { label: "Для гостиной", value: "living_room" },
        { label: "Для спальни", value: "bedroom" },
        { label: "Детские", value: "kids" },
        { label: "Кухонные", value: "kitchen" },
        { label: "Для прихожей", value: "hallway" },
        { label: "Офисные", value: "office" },
        { label: "Кабинетные", value: "cabinet" },
        { label: "Для лестниц", value: "stairs" },
        { label: "Уличные", value: "outdoor" },
    ],

};

export default function Menu() {

    return (
        <div className="w-full bg-white pb-5">
            <div className="flex flex-col gap-8 pl-5 md:pl-14 pr-5 px-4 justify-between">
                {/* Header & Nav */}
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
                                <p className="text-sm text-gray-500">Онлайн интернет магазин</p>
                            </div>
                        </div>

                        <nav className="flex flex-wrap gap-4 md:gap-8 text-[16px] font-medium text-[#333]">
                            <Link href="/about">О нас</Link>
                            <Link href="/delivery">О доставке</Link>
                            <Link href="/payment">Об оплате</Link>
                        </nav>
                    </div>

                    {/* Categories as Links */}
                    <div className="flex flex-wrap gap-4 my-[45px] md:gap-8">
                        {filters.category.map((item) => (
                            <Link
                                key={item.value}
                                href={`/?category=${item.value}`}
                                className="text-[15px] text-[#333] hover:text-black hover:underline transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Contacts */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-[#333]">Контакты</h4>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Адрес</p>
                                <p className="text-sm font-medium text-[#333]">
                                    ул.Паркентский,131 А
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Номер</p>
                                <a
                                    href="tel:+998991404422"
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