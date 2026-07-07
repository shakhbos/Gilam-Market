"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import Masonry from "react-masonry-css";

import Back from "@/components/back";
import GlamCard from "@/components/glam-card";
import GlamCardSkeleton from "@/components/skeletons/glam-card-skeleton";
import { BackPlusIcons, LikeIcons, ShareIcons } from "@/components/icons";
import { changeBuskets, changeLike } from "@/lib/features";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchData } from "@/service/get";
import { minio_img_url } from "@/utils/divice";
import { formatSizeRange } from "@/utils/format-size-range";
import type { GroupSize, PaginatedResponse, QrBaseProduct } from "@/types/api";

interface Props {
  id: string;
  locale: string;
  product: QrBaseProduct;
  relatedProducts: QrBaseProduct[];
  /**
   * SSR paytida `/currency` public endpoint'idan olingan joriy USD → UZS kursi.
   * Narx hisoblash: market_priceMeter_usd × kv × usdRate.
   */
  usdRate: number;
}

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 2,
};

/**
 * Bitta mahsulot detail sahifasi.
 *
 * Backend response — SINGLE object. Guruh (Collection + Model + Shape + Color)
 * ichidagi barcha aktiv o'lchamlar `product.sizes[]` orqali keladi; ular
 * chip'lar bilan ko'rsatiladi va har biriga qoldiq soni yoziladi.
 * O'lchamlar bir xil qrBase'ga tegishli emas (har biri o'z sizeId'siga ega),
 * shu sababli chip informativ — tanlash uchun kelgusi backend'da
 * "sibling qrBase id" qo'shilishi kerak.
 */
/**
 * Detail sahifada ko'rsatiladigan bitta media element.
 * Video bo'lsa `kind='video'` va thumb sifatida main image ishlatiladi
 * (video thumbnail yaratmaymiz, backend keshda yo'q).
 */
type MediaItem = {
  key: string;
  kind: "image" | "video";
  url: string;
  thumb: string;
};

export default function GlamById({ product, relatedProducts, usdRate }: Props) {
  const t = useTranslations("Product");
  const [tab, setTab] = useState<1 | 2>(1);

  const dispatch = useAppDispatch();
  const { buskets } = useAppSelector((store) => store.buskets);
  const { likes } = useAppSelector((store) => store.likes);

  const imageUrl = product.imgUrl?.path
    ? `${minio_img_url}${product.imgUrl.path}`
    : "";
  const videoUrl = product.videoUrl?.path
    ? `${minio_img_url}${product.videoUrl.path}`
    : "";
  const otherImages: MediaItem[] = (product.other_images ?? [])
    .filter((m) => !!m?.path)
    .map((m, i) => ({
      key: `other-${m.id ?? i}`,
      kind: "image" as const,
      url: `${minio_img_url}${m.path}`,
      thumb: `${minio_img_url}${m.path}`,
    }));

  const gallery: MediaItem[] = [
    ...(imageUrl
      ? [
          {
            key: "main",
            kind: "image" as const,
            url: imageUrl,
            thumb: imageUrl,
          },
        ]
      : []),
    ...otherImages,
    ...(videoUrl
      ? [
          {
            key: "video",
            kind: "video" as const,
            url: videoUrl,
            thumb: imageUrl || "/empty-folder.png",
          },
        ]
      : []),
  ];
  const [activeIdx, setActiveIdx] = useState(0);
  const active = gallery[activeIdx];

  const collectionTitle =
    product.collection?.internetTitle?.trim() ||
    product.collection?.title ||
    "";
  const modelTitle = product.model?.title ?? "";
  const sizes: GroupSize[] = product.sizes ?? [];
  const totalInStock = sizes.reduce((acc, s) => acc + Number(s.count || 0), 0);
  const isInCart = buskets.some((b) => b.id === product.id);
  const isLiked = likes.some((l) => l.id === product.id);

  // Narx admin /price sahifasidan I-Manager kiritgan qiymatga bog'liq:
  //   collection_prices[type='market'].priceMeter — USD/m²
  //   total_uzs = priceMeter × kv × usdRate
  // usdRate SSR paytida /currency (public) endpoint'idan olinadi.
  const marketPriceUsd = (() => {
    const prices = product.collection?.collection_prices ?? [];
    return Number(prices.find((p) => p.type === "market")?.priceMeter || 0);
  })();
  const priceForSize = (sX?: number, sY?: number) => {
    const kv = Number(sX ?? 0) * Number(sY ?? 0);
    return marketPriceUsd * kv * usdRate;
  };
  const mainPriceUzs = priceForSize(product.size?.x, product.size?.y);
  const uzsFormatter = new Intl.NumberFormat("ru-RU");

  // Chip → cart item: joriy product'ning umumiy fieldlarini (collection,
  // model, imgUrl, i_price...) ko'chirib, faqat id + size + stock aynan
  // shu chip'ga tegishli qilib almashtiramiz. Shu tariqa siblinglar
  // uchun sotib olish ma'lumotlari to'liq bo'ladi.
  const chipToCartItem = (s: GroupSize) => {
    const kv = Number(s.x || 0) * Number(s.y || 0);
    // i_price maydonini "narx per m²" so'mda saqlaymiz — savatcha kartochkasi
    // va order servisi bir xil formula ishlatadi: i_price × count × size.kv.
    // Bu bilan admin narxi (USD) foydalanuvchi ko'radigan so'm summasiga mos
    // bo'ladi.
    const pricePerM2Uzs = marketPriceUsd * usdRate;
    return {
      ...product,
      id: s.qrBaseId || product.id,
      size: {
        ...(product.size ?? {}),
        id: s.id,
        x: s.x,
        y: s.y,
        kv,
        title: `${Math.round(s.x * 100)}x${Math.round(s.y * 100)}`,
      } as QrBaseProduct["size"],
      i_price: pricePerM2Uzs,
      stock_this_size: s.count,
    };
  };

  // O'lcham tanlash bosqichi: chip bosilganda faqat SELECT bo'ladi (visual),
  // savatga qo'shish tugmasi bosilgach zakaz cartga tushadi. Bir chipni qayta
  // bosish tanlashni bekor qiladi. Faqat 1 ta o'lcham mavjud bo'lsa avtomatik
  // tanlanadi (useEffect quyida).
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  // Foydalanuvchi hech qanday chip tanlamay tugmani bossa — chipni orange
  // border bilan yoritamiz (attention seeker) va toast'da ogohlantiramiz.
  // Chip tanlanishi bilan highlight avtomatik o'chadi.
  const [highlightChips, setHighlightChips] = useState(false);

  useEffect(() => {
    const active = sizes.filter((s) => Number(s.count) > 0 && !!s.qrBaseId);
    if (active.length === 1) {
      setSelectedSizeId(active[0].id);
    } else {
      setSelectedSizeId(null);
    }
    // sizes referensiyasi har render'da o'zgarishi mumkin — id'lar bo'yicha
    // qayta hisoblaymiz. product.id o'zgarganda ham reset qilamiz.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, sizes.map((s) => `${s.id}:${s.count}`).join(",")]);

  const selectedSize = sizes.find((s) => s.id === selectedSizeId) ?? null;

  const selectSize = (s: GroupSize) => {
    if (!s.qrBaseId) return;
    setHighlightChips(false);
    setSelectedSizeId((cur) => (cur === s.id ? null : s.id));
  };

  // --- Pinterest-style pastdagi cheksiz scroll --- //
  // Related products bilan boshlanadi, keyin /qr-base/i-market sahifa-
  // sahifa yuklanadi. Ikkinchi ro'yxatda joriy productni va related'da
  // ko'rilgan ID'larni dedup qilamiz.
  const PAGE_SIZE = 20;
  const [browsed, setBrowsed] = useState<QrBaseProduct[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const seenIds = useMemo(() => {
    const set = new Set<string>();
    set.add(product.id);
    relatedProducts.forEach((r) => set.add(r.id));
    browsed.forEach((r) => set.add(r.id));
    return set;
  }, [product.id, relatedProducts, browsed]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetchData<PaginatedResponse<QrBaseProduct>>(
        `${process.env.NEXT_PUBLIC_URL}/qr-base/i-market`,
        { page, limit: PAGE_SIZE, status: "published" },
      );
      const fresh = (res?.items ?? []).filter((p) => !seenIds.has(p.id));
      setBrowsed((prev) => [...prev, ...fresh]);
      setPage((p) => p + 1);
      if (!res?.items?.length || res.items.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, seenIds]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "1800px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const addToCart = () => {
    // Ikki holat:
    //   1) Sizes ro'yxati bor — foydalanuvchi chip tanlab tugmani bosgan.
    //      Tanlangan chip'ni cartga qo'shamiz va selectionni tozalaymiz
    //      (chip va tugma yana kulrang holatga qaytadi).
    //   2) Sizes yo'q (legacy fallback) — butun productni toggle qilamiz.
    if (sizes.length > 0) {
      if (!selectedSize) {
        // Tanlanmagan: ogohlantirish + chiplarni orange border bilan yoritish
        setHighlightChips(true);
        toast.warning(t("selectSizeFirst"));
        return;
      }
      const item = chipToCartItem(selectedSize);
      // Duplikat oldini olish: agar shu qrBaseId cartda bor bo'lsa, faqat
      // selectionni tozalaymiz (miqdorni oshirish cart sahifasidan bo'ladi).
      if (!buskets.some((b) => b.id === item.id)) {
        dispatch(changeBuskets([item, ...buskets]));
      }
      setSelectedSizeId(null);
      return;
    }
    // Legacy: product.i_price stale bo'lishi mumkin — cart uchun UZS-per-m²
    // qayta hisoblanadi va size.kv majburiy o'rnatiladi.
    const pricePerM2Uzs = marketPriceUsd * usdRate;
    const cartProduct = {
      ...product,
      i_price: pricePerM2Uzs,
      size: {
        ...(product.size ?? {}),
        kv:
          Number(product.size?.kv || 0) ||
          Number(product.size?.x || 0) * Number(product.size?.y || 0),
      } as QrBaseProduct["size"],
    };
    dispatch(
      isInCart
        ? changeBuskets(buskets.filter((it) => it.id !== product.id))
        : changeBuskets([cartProduct, ...buskets]),
    );
  };
  const toggleLike = () => {
    dispatch(
      isLiked
        ? changeLike(likes.filter((it) => it.id !== product.id))
        : changeLike([product, ...likes]),
    );
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("linkCopied"));
    } catch {
      // Clipboard API mavjud emas — sukut o'chirish.
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-start px-4 md:px-[30px] mt-[26px] gap-8 lg:gap-[35px] items-start">
        <div className="hidden lg:block">
          <Back />
        </div>

        <div className="flex flex-col-reverse lg:flex-row w-full gap-4 max-w-full lg:max-w-[620px]">
          {/* Thumbnail satri — asosiy rasm + qo'shimcha rasmlar + video (bo'lsa).
              Video thumb'ida qoplama play iconi turadi. */}
          {gallery.length > 1 && (
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible w-full lg:w-[81px] pb-2 lg:pb-0 no-scrollbar">
              {gallery.map((m, idx) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`relative shrink-0 w-[81px] h-[100px] overflow-hidden rounded-md border-2 transition ${
                    idx === activeIdx
                      ? "border-[#212121]"
                      : "border-transparent hover:border-[#e5e5e5]"
                  }`}
                  aria-label={m.kind === "video" ? "Video" : `Image ${idx + 1}`}
                >
                  <Image
                    src={m.thumb}
                    width={81}
                    height={100}
                    className="object-cover w-full h-full"
                    alt={modelTitle || "Product thumbnail"}
                  />
                  {m.kind === "video" && (
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center bg-black/25"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width={22}
                        height={22}
                        fill="white"
                      >
                        <path d="M8 5v14l11-7L8 5z" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Asosiy media panel */}
          {active ? (
            <div className="relative w-full flex items-center justify-center aspect-[6/4] lg:aspect-[4/4] lg:max-h-[740px] rounded-lg overflow-hidden bg-[#fcfcfc]">
              {active.kind === "video" ? (
                <video
                  key={active.url}
                  src={active.url}
                  controls
                  playsInline
                  preload="metadata"
                  poster={active.thumb}
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <Image
                  src={active.url}
                  width={800}
                  height={800}
                  className="object-contain w-full h-full"
                  alt={modelTitle || "Product main image"}
                  priority={active.key === "main"}
                  sizes="(max-width: 768px) 100vw, 620px"
                />
              )}
            </div>
          ) : (
            <div className="flex items-center aspect-[3/4] sm:aspect-[2/3] w-full max-w-full lg:max-w-[500px] bg-[#F0F0E5] justify-center rounded-lg">
              <Image
                src="/empty-folder.png"
                width={60}
                height={60}
                alt={t("noImage")}
              />
            </div>
          )}
        </div>

        <div className="w-full lg:max-w-[530px] mt-4 lg:mt-[20px]">
          {/* 1-qator: kolleksiya nomi yakka o'zi (katta bosh sarlavha). */}
          <h1 className="text-[28px] lg:text-[40px] leading-[34px] lg:leading-[50px] font-semibold text-[#282A2C] mb-2 lg:mb-3">
            {collectionTitle}
          </h1>
          {/* 2-qator: model nomi + 1 m² narxi (so'mda). Narx marketPriceUsd
              × usdRate — jami emas, faqat metr kvadrat. */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 sm:mb-5 gap-2">
            <h2 className="text-[18px] lg:text-[22px] leading-[24px] lg:leading-[28px] text-[#282A2C] font-normal">
              {modelTitle}
            </h2>
            <p
              className="text-[20px] lg:text-[24px] leading-[24px] lg:leading-[26px] font-medium text-[#212121]"
              aria-label={t("priceLabel")}
            >
              {uzsFormatter.format(Math.round(marketPriceUsd * usdRate))} sum / m²
            </p>
          </div>

          {/* Guruhga tegishli aktiv o'lchamlar — chip'lar bosilganda cart'ga
              qo'shiladi/o'chiriladi. Foydalanuvchi 1 yoki bir necha size
              tanlashi mumkin — har biri sibling QrBase sifatida saqlanadi
              va cart'da alohida qator bo'ladi. */}
          {sizes.length > 0 && (
            <section aria-label={t("availableSizes")} className="mb-[32px] lg:mb-[49px]">
              <p className="text-[14px] text-[#6B6B6B] mb-2">
                {t("availableSizes")}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const label = `${Math.round(Number(s.x || 0) * 100)}x${Math.round(Number(s.y || 0) * 100)}`;
                  const isSelected = selectedSizeId === s.id;
                  const disabled = !s.qrBaseId || Number(s.count) <= 0;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectSize(s)}
                      disabled={disabled}
                      aria-pressed={isSelected}
                      title={t("inStock", { count: s.count })}
                      className={`px-3 py-2 rounded-[5px] text-[14px] lg:text-[16px] inline-flex items-center gap-2 transition-colors border ${
                        isSelected
                          ? "bg-[#121212] text-white border-[#121212]"
                          : highlightChips
                            ? "bg-[#F4F4F4] text-[#212121] border-[#F97316] animate-pulse"
                            : "bg-[#F4F4F4] text-[#212121] border-transparent hover:border-[#121212]"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span>{label}</span>
                      <span
                        className={`text-[12px] ${isSelected ? "text-white/70" : "text-[#6B6B6B]"}`}
                      >
                        ({s.count})
                      </span>
                    </button>
                  );
                })}
              </div>
              {totalInStock === 0 && (
                <p className="text-[12px] text-red-500 mt-2">
                  {t("outOfStock")}
                </p>
              )}
            </section>
          )}

          <div className="w-full border-b-[1px] mb-[24px] lg:mb-[32px] relative flex">
            <button
              type="button"
              onClick={() => setTab(1)}
              aria-pressed={tab === 1}
              className={`${
                tab === 1
                  ? "text-black border-black"
                  : "text-gray-500 border-transparent opacity-70"
              } text-[15px] lg:text-[16px] font-medium inline-block px-4 py-3 border-b-2 transition-all cursor-pointer bg-transparent`}
            >
              {t("characteristics")}
            </button>
            <button
              type="button"
              onClick={() => setTab(2)}
              aria-pressed={tab === 2}
              className={`${
                tab === 2
                  ? "text-black border-black"
                  : "text-gray-500 border-transparent opacity-70"
              } text-[15px] lg:text-[16px] font-medium inline-block px-4 py-3 border-b-2 transition-all cursor-pointer bg-transparent`}
            >
              {t("paymentAndDelivery")}
            </button>
          </div>

          {tab === 1 ? (
            <div>
              <p className="text-[14px] lg:text-[15px] text-[#282A2C] leading-[22px] whitespace-pre-line">
                {/*
                  Xususiyatlari — admin/product-characteristics sahifasidan
                  kolleksiya darajasida saqlanadi (collection.description).
                  QrBase.internetInfo eski maydon, fallback sifatida qoladi.
                */}
                {(product.collection as any)?.description?.trim() ||
                  product.internetInfo ||
                  ""}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[14px] lg:text-[15px] text-[#282A2C] leading-[22px] whitespace-pre-line">
                {/* To'lov va yetkazish — collection.paymentDeliveryInfo. */}
                {(product.collection as any)?.paymentDeliveryInfo?.trim() ||
                  t("paymentDeliveryInfo")}
              </p>
            </div>
          )}

          {/* Uchta harakat tugmasi bitta chiziqda — chapdan o'ngga
              to'liq kenglikni to'ldiradi. Cart flex-1 (asosiy, kengroq),
              Yoqdi va Ulashish tabiiy o'lchamda. */}
          {/*
              Cart tugmasi ACTIVE bo'ladi qachonki: (a) sizes ro'yxati bor va
              foydalanuvchi chip tanlagan, YOKI (b) sizes yo'q (legacy) va
              product hozircha cartda emas. Aks holda tugma kul rang, LEKIN
              bosilishi mumkin — bosilganda foydalanuvchiga toast bilan
              "o'lcham tanlang" xabari va chiplarga orange border chiqadi.
              Kul rang holatda ikon qora rangda qoladi (foydalanuvchi ikonni
              ko'rib turadi).
          */}
          <div className="mt-[30px] lg:mt-[50px] mb-[36px] flex items-stretch gap-2 sm:gap-3 w-full">
            {(() => {
              const hasSizes = sizes.length > 0;
              const cartActive = hasSizes ? !!selectedSize : !isInCart;
              return (
                <button
                  type="button"
                  onClick={addToCart}
                  className={`flex-1 text-[13px] md:text-[14px] font-medium py-2 sm:py-[10px] rounded-lg px-4 sm:px-5 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    cartActive
                      ? "bg-[#121212] text-white hover:bg-gray-800"
                      : "bg-[#F4F4F4] text-[#9A9A9A] hover:bg-[#EAEAEA]"
                  }`}
                >
                  {!hasSizes && isInCart ? (
                    t("added")
                  ) : (
                    <>
                      <BackPlusIcons stroke={cartActive ? "white" : "#121212"} />{" "}
                      {t("addToCart")}
                    </>
                  )}
                </button>
              );
            })()}

            <button
              type="button"
              onClick={toggleLike}
              aria-pressed={isLiked}
              className="shrink-0 text-[#121212] bg-[#F4F4F4] text-[13px] md:text-[14px] font-medium py-2 sm:py-[10px] rounded-lg px-4 sm:px-5 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <LikeIcons
                stroke={isLiked ? "red" : "black"}
                fill={isLiked ? "red" : "none"}
              />
              {t("like")}
            </button>

            <button
              type="button"
              onClick={share}
              className="shrink-0 text-[#121212] bg-[#F4F4F4] text-[13px] md:text-[14px] font-medium py-2 sm:py-[10px] rounded-lg px-4 sm:px-5 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <ShareIcons />
              {t("share")}
            </button>
          </div>
        </div>
      </div>

      {/* Related products + Pinterest-style cheksiz scroll: bittada
          bir xil Masonry ichida keladi — foydalanuvchi uchun ustun
          uzilishlari sezilmaydi. */}
      {(relatedProducts.length > 0 || browsed.length > 0) && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-8 mt-60"
          columnClassName="flex flex-col gap-16"
        >
          {[...relatedProducts, ...browsed].map((e) => {
            const cardImg = e.imgUrl?.path
              ? `${minio_img_url}${e.imgUrl.path}`
              : "";
            const cardVideo = e.videoUrl?.path
              ? `${minio_img_url}${e.videoUrl.path}`
              : undefined;
            const cardIsLiked = likes.some((l) => l.id === e.id);
            const cardInCart = buskets.some((b) => b.id === e.id);
            return (
              <GlamCard
                key={e.id}
                className="colm1"
                url={`/glam/${e.id}?modelId=${encodeURIComponent(e.model?.title ?? "")}&color=${encodeURIComponent(e.color?.title ?? "")}&collectionId=${encodeURIComponent(e.collection?.title ?? "")}`}
                title={`${e.collection?.title ?? ""} ${e.model?.title ?? ""}`.trim()}
                type={e.sizeType ?? undefined}
                text={formatSizeRange(e)}
                image={cardImg}
                video={cardVideo}
                isLike={cardIsLiked}
                onLike={() =>
                  dispatch(
                    cardIsLiked
                      ? changeLike(likes.filter((it) => it.id !== e.id))
                      : changeLike([e, ...likes]),
                  )
                }
                onBuslet={() =>
                  dispatch(
                    cardInCart
                      ? changeBuskets(buskets.filter((it) => it.id !== e.id))
                      : changeBuskets([e, ...buskets]),
                  )
                }
                isloading={undefined}
              />
            );
          })}
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <GlamCardSkeleton key={`sk-${i}`} />
            ))}
        </Masonry>
      )}

      {/* Sentinel — IntersectionObserver ushbu elementga ~1800px yaqinlashganda
          keyingi sahifani yuklaydi. hasMore=false bo'lganda ham DOM'da qoladi
          (invisible) — sxema soddaligi uchun. */}
      <div ref={sentinelRef} className="h-10 w-full" />
    </>
  );
}
