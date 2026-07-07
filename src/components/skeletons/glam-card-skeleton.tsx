import React from "react";

export default function GlamCardSkeleton() {
    return (
        <div className="mb-1 break-inside-avoid w-full">
            <div className="text-center">
                <div className="w-full h-auto min-h-[100px] relative group flex text-center items-center justify-center">
                    <div className="p-4 max-w-sm w-full mx-auto">
                        <div className="animate-pulse space-y-4">
                            <div className="h-[250px] sm:h-[350px] md:h-[400px] bg-gray-200 rounded-lg w-full"></div>
                        </div>
                    </div>
                </div>
                <div className="px-4 mt-3 mb-2 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        </div>
    );
}
