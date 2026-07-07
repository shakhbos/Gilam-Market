"use client";
import React from "react";
import { useRouter } from "../i18n/routing";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

interface InfoPageLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function InfoPageLayout({ title, children }: InfoPageLayoutProps) {
    const router = useRouter();

    return (
        <div className="w-full min-h-screen bg-white pt-[80px] pb-[100px] px-4 sm:px-[30px]">
            <div className="max-w-[800px] mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>{title}</span>
                    </button>
                </div>

                <div className="prose w-full max-w-none">
                    {children}
                </div>
            </div>
        </div>
    );
}
