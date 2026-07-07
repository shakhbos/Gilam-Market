"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "../i18n/routing";
import { CloseIcons } from "./icons";

interface FilterModalProps {
    onClose: () => void;
}



export default function FilterModal({ onClose }: FilterModalProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [styles, setStyles] = useState<{ id: string; title: string; image?: string }[]>([]);
    const [colors, setColors] = useState<{ id: string; title: string; code?: string }[]>([]);
    const [shapes, setShapes] = useState<{
        id: string,
        title: string,
        meter: string
    }[]>([]);
    const [sizes, setSizes] = useState<{ id: string; title: string; code?: string }[]>([]);
    const [selectedType, setSelectedType] = useState<"piece" | "meter">("piece");

    useEffect(() => {
        const fetchShape = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/shape`);
                if (res.ok) {
                    const data = await res.json();

                    if (data && Array.isArray(data)) {
                        setShapes(data);
                    } else if (data && data.items && Array.isArray(data.items)) {
                        setShapes(data.items);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch styles:", error);
            }
        };
        const fetchStyles = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/style`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data)) {
                        setStyles(data);
                    } else if (data && data.items && Array.isArray(data.items)) {
                        setStyles(data.items);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch styles:", error);
            }
        };

        const fetchColors = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/color`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data)) {
                        setColors(data);
                    } else if (data && data.items && Array.isArray(data.items)) {
                        setColors(data.items);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch colors:", error);
            }
        };
        const fetchSizes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/size`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data)) {
                        setSizes(data);
                    } else if (data && data.items && Array.isArray(data.items)) {
                        setSizes(data.items);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch colors:", error);
            }
        };

        fetchStyles();
        fetchColors();
        fetchShape()
        fetchSizes()
    }, []);

    const handleFilterChange = (type: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        const existing = params.get(type)?.split(",") || [];

        if (existing.includes(value)) {
            const updated = existing.filter((item) => item !== value);
            if (updated.length > 0) {
                params.set(type, updated.join(","));
            } else {
                params.delete(type);
            }
        } else {
            existing.push(value);
            params.set(type, existing.join(","));
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    const isChecked = (type: string, value: string) => {
        const existing = searchParams.get(type)?.split(",") || [];
        return existing.includes(value);
    };

    const clearFilters = () => {
        router.replace(pathname);
        onClose();
    };
    console.log(shapes)

    return (
        <div className="fixed z-[1000] inset-0 bg-[#00000080] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-[800px] h-[90vh] overflow-y-auto rounded-[12px] relative flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 flex justify-end sticky top-0 bg-white z-10">
                    <button onClick={onClose}>
                        <CloseIcons width={24} height={24} />
                    </button>
                </div>

                <div className="px-6 pb-20 overflow-y-auto flex-1">
                    <div className="flex gap-4 justify-center mb-8">
                        <div
                            onClick={() => setSelectedType("piece")}
                            className={`cursor-pointer  w-full flex flex-col items-center gap-2 ${selectedType === "piece" ? "opacity-100" : "opacity-50"}`}
                        >
                            <div className="w-full text-center flex items-end justify-center h-[160px] bg-gray-100 rounded-lg overflow-hidden relative">
                                <Image className="w-[222px] h-[149px]" src="/count.png" alt="Piece" width={222} height={149} />
                            </div>
                            <span className="text-sm font-medium">Штучные ковры</span>
                        </div>
                        <div
                            onClick={() => setSelectedType("meter")}
                            className={`cursor-pointer flex  w-full flex-col items-center gap-2 ${selectedType === "meter" ? "opacity-100" : "opacity-50"}`}
                        >
                            <div className="w-full text-center h-[160px]  flex items-end justify-center bg-gray-100 rounded-lg overflow-hidden relative">
                                <Image className="w-[222px] h-[149px]" src="/metric.png" alt="Piece" width={222} height={149} />
                            </div>
                            <span className="text-sm font-medium">Метражные ковры</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-center font-bold mb-4">Форма</h3>
                        <div className="flex flex-wrap justify-center gap-6">
                            {shapes.map((shape) => (
                                <div key={shape.id} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleFilterChange("shape", shape.id)}>
                                    <div className={`w-[80px] h-[80px] bg-gray-100 flex items-center justify-center ${isChecked("shape", shape.id) ? "ring-2 ring-black" : ""}`}>
                                        <span className="text-xs">{shape.title}</span>
                                    </div>
                                    <span className="text-xs text-center text-gray-500">{shape.meter}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Styles */}
                    <div className="mb-8">
                        <h3 className="text-center font-bold mb-4">Стиль</h3>
                        <div className="flex flex-wrap justify-center gap-6">
                            {styles.map((style) => (
                                <div
                                    key={style.id}
                                    className="flex flex-col items-center gap-2 cursor-pointer"
                                    onClick={() => handleFilterChange("style", style.id)}
                                >
                                    <div className={`w-[80px] h-[80px] bg-gray-100 rounded-lg overflow-hidden ${isChecked("style", style.id) ? "ring-2 ring-black" : ""}`}>
                                        {/* Style Image Placeholder */}
                                        <div className="w-full h-full bg-gray-200"></div>
                                    </div>
                                    <span className="text-xs text-center text-gray-500">{style.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="mb-8">
                        <h3 className="text-center font-bold mb-4">Цвет</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {colors.map((color) => (
                                <div
                                    key={color.id}
                                    onClick={() => handleFilterChange("color", color.id)}
                                    className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center ${isChecked("color", color.id) ? "ring-2 ring-black ring-offset-2" : ""}`}
                                    style={{ backgroundColor: color.code || '#ccc' }} // Fallback color
                                    title={color.title}
                                >
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="mb-8">
                        <h3 className="text-center font-bold mb-4">Размеры</h3>
                        <div className="flex flex-col md:flex-row justify-center gap-8">
                            <div className="flex flex-col items-center">
                                <span className="mb-2 text-sm font-medium">Ширина (x)</span>
                                <div className="grid grid-cols-7 gap-2">
                                    {sizes.map((size, i) => (
                                        <div
                                            key={i}
                                            className={`w-10 h-8 flex items-center justify-center bg-gray-50 text-xs rounded cursor-pointer hover:bg-gray-100 ${isChecked('width', size?.id) ? 'bg-black text-white hover:bg-black' : ''}`}
                                            onClick={() => handleFilterChange("width", size?.id)}
                                        >
                                            {size?.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="mb-2 text-sm font-medium">Длина (y)</span>
                                <div className="grid grid-cols-7 gap-2">
                                    {sizes.map((size, i) => (
                                        <div
                                            key={i}
                                            className={`w-10 h-8 flex items-center justify-center bg-gray-50 text-xs rounded cursor-pointer hover:bg-gray-100 ${isChecked('length', size?.id) ? 'bg-black text-white hover:bg-black' : ''}`}
                                            onClick={() => handleFilterChange("length", size?.id)}
                                        >
                                            {size?.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white p-4 border-t flex gap-4 z-10">
                    <button
                        onClick={clearFilters}
                        className="flex-1 py-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>✕</span> Очистить
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Показать результат (1845)
                    </button>
                </div>
            </div>
        </div>
    );
}
