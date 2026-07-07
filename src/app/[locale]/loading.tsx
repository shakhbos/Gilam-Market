"use client";
import React from "react";
import { Spin } from "antd";

export default function Loading() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white z-[9999]">
            <Spin size="large" />
        </div>
    );
}
