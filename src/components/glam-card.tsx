"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "../i18n/routing";
import { BusketIcons, LikeIcons } from "./icons";

const typeObj: Record<string, number> = {
  extraSmall: 52,
  small: 63,
  medium: 75,
  large: 87,
  extraLarge: 100,
};

interface GlamCardProps {
  className?: string;
  url: string;
  title: string;
  text?: string;
  image?: string;
  /**
   * Ixtiyoriy qisqa video URL (MinIO/CDN'dan). Berilsa hover holatda main
   * image o'rniga muted+loop autoplay bo'ladi. Bo'sh bo'lsa hover ta'sir
   * qilmaydi, faqat rasm turadi.
   */
  video?: string;
  type?: string | null;
  isLike?: boolean;
  isloading?: unknown;
  onLike?: (e: MouseEvent<HTMLDivElement>) => void;
  onBuslet?: (e: MouseEvent<HTMLDivElement>) => void;
}

/**
 * Katalog kartochkasi — bosh sahifa Masonry gridida ishlatiladi.
 * - Default: main image.
 * - Hover (agar video bor bo'lsa): video autoplay (muted+loop, faqat
 *   pointer ustidan turgan paytda).
 * - Yuklanish paytida skelet ko'rsatiladi.
 */
export default function GlamCard({
  className,
  onBuslet,
  type,
  onLike,
  isLike,
  url,
  title,
  text,
  image,
  video,
  isloading,
}: GlamCardProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoActive, setVideoActive] = useState(false);
  const sizeKey = type ?? "";
  const percentage = typeObj[sizeKey] ?? 100;
  const hasVideo = !!video;

  const startVideo = () => {
    if (!hasVideo) return;
    setVideoActive(true);
    const el = videoRef.current;
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {
        // Autoplay bloklangan (iOS) — sukut bilan yopamiz.
      });
    }
  };

  const stopVideo = () => {
    if (!hasVideo) return;
    setVideoActive(false);
    const el = videoRef.current;
    if (el) {
      el.pause();
    }
  };

  return (
    <article className="mb-1 group break-inside-avoid w-full">
      <div className={`${className ?? ""} text-center`}>
        <div
          className="w-full h-auto min-h-[100px] relative flex text-center items-center justify-center"
          onMouseEnter={startVideo}
          onMouseLeave={stopVideo}
        >
          {isloading ? (
            <div className="p-4 max-w-sm w-full mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-[500px] bg-gray-300 rounded"></div>
              </div>
            </div>
          ) : image ? (
            <div
              className="relative m-auto cursor-pointer ease-in duration-200 hover:-translate-y-1"
              style={{ width: `${percentage}%` }}
              onClick={() => router.push(url)}
            >
              <Image
                height={1000}
                width={1000}
                className={`object-contain w-full bg-transparent transition-opacity duration-200 ${
                  hasVideo && videoActive ? "opacity-0" : "opacity-100"
                }`}
                src={image}
                alt={title || "Product Image"}
                title={title}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {hasVideo && (
                <video
                  ref={videoRef}
                  src={video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ${
                    videoActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </div>
          ) : (
            <div
              style={{
                width: `${percentage}%`,
                height: `${(500 * percentage) / 100}px`,
              }}
              className="flex items-center mx-auto w-full bg-[#F0F0E5] justify-center"
            >
              <Image src="/empty-folder.png" width={60} height={60} alt="img" />
            </div>
          )}
          <div
            className={`absolute ${
              isLike ? "flex" : "hidden"
            } group-hover:flex bottom-[25px] left-0 gap-1 w-full items-center justify-center pointer-events-none`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(e);
              }}
              className="p-[10px] bg-white cursor-pointer pointer-events-auto"
            >
              <LikeIcons
                stroke={isLike ? "red" : "black"}
                fill={isLike ? "red" : "none"}
              />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onBuslet?.(e);
              }}
              className="p-[10px] bg-white cursor-pointer pointer-events-auto"
            >
              <BusketIcons />
            </div>
          </div>
        </div>
        <h3
          onClick={() => router.push(url)}
          className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] cursor-pointer group-hover:underline group-hover:decoration-solid leading-[18px] sm:leading-[25px] font-normal mt-3 mb-2"
        >
          {title}
        </h3>
        <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] leading-[14px] sm:leading-[18px] font-normal">
          {text}
        </p>
      </div>
    </article>
  );
}
