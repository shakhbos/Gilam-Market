"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import Masonry from "react-masonry-css";

import Back from "@/components/back";
import GlamCard from "@/components/glam-card";
import { BackPlusIcons, LikeIcons, ShareIcons } from "@/components/icons";
import { changeBuskets, changeLike } from "@/lib/features";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { minio_img_url } from "@/utils/divice";
import type { GroupSize, QrBaseProduct } from "@/types/api";

interface Props {
  id: string;
  locale: string;
  product: QrBaseProduct;
  relatedProducts: QrBaseProduct[];
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
export default function GlamById({ product, relatedProducts }: Props) {
  const t = useTranslations("Product");
  const [tab, setTab] = useState<1 | 2>(1);

  const dispatch = useAppDispatch();
  const { buskets } = useAppSelector((store) => store.buskets);
  const { likes } = useAppSelector((store) => store.likes);

  const imageUrl = product.imgUrl?.path
    ? `${minio_img_url}${product.imgUrl.path}`
    : "";
  const collectionTitle =
    product.collection?.internetTitle?.trim() ||
    product.collection?.title ||
    "";
  const modelTitle = product.model?.title ?? "";
  const sizes: GroupSize[] = product.sizes ?? [];
  const totalInStock = sizes.reduce((acc, s) => acc + Number(s.count || 0), 0);
  const isInCart = buskets.some((b) => b.id === product.id);
  const isLiked = likes.some((l) => l.id === product.id);

  const toggleCart = () => {
    dispatch(
      isInCart
        ? changeBuskets(buskets.filter((it) => it.id !== product.id))
        : changeBuskets([product, ...buskets]),
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
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible w-full lg:w-[81px] pb-2 lg:pb-0 no-scrollbar">
            {imageUrl && (
              <Image
                src={imageUrl}
                width={81}
                height={100}
                className="flex shrink-0 items-center object-contain justify-center w-[81px] overflow-hidden rounded-md"
                alt={modelTitle || "Product thumbnail"}
              />
            )}
          </div>

          {imageUrl ? (
            <div className="relative w-full flex items-center justify-center aspect-[6/4] lg:aspect-[4/4] lg:max-h-[740px] rounded-lg overflow-hidden bg-[#fcfcfc]">
              <Image
                src={imageUrl}
                width={800}
                height={800}
                className="object-contain w-full h-full"
                alt={modelTitle || "Product main image"}
                priority
                sizes="(max-width: 768px) 100vw, 620px"
              />
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
          <h1 className="text-[18px] lg:text-[24px] leading-[24px] lg:leading-[30px] text-wrap lg:text-nowrap text-[#282A2C] font-normal mb-2">
            {modelTitle}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 gap-2">
            <h2 className="text-[28px] lg:text-[40px] leading-[34px] lg:leading-[50px] font-semibold text-[#282A2C]">
              {collectionTitle}
            </h2>
            <p
              className="text-[20px] lg:text-[24px] leading-[24px] lg:leading-[26px] font-medium text-[#212121]"
              aria-label={t("priceLabel")}
            >
              {Number(product.i_price ?? 0).toLocaleString()} sum
            </p>
          </div>

          {/* Guruhga tegishli aktiv o'lchamlar — har biriga qoldiq soni bilan.
              Chip'lar informativ, tanlash uchun. */}
          {sizes.length > 0 && (
            <section aria-label={t("availableSizes")} className="mb-[32px] lg:mb-[49px]">
              <p className="text-[14px] text-[#6B6B6B] mb-2">
                {t("availableSizes")}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const label = `${Math.round(Number(s.x || 0) * 100)}x${Math.round(Number(s.y || 0) * 100)}`;
                  return (
                    <span
                      key={s.id}
                      title={t("inStock", { count: s.count })}
                      className="bg-[#F4F4F4] text-[#212121] px-3 py-2 rounded-[5px] text-[14px] lg:text-[16px] inline-flex items-center gap-2"
                    >
                      <span>{label}</span>
                      <span className="text-[12px] text-[#6B6B6B]">
                        ({s.count})
                      </span>
                    </span>
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
                {product.internetInfo ?? ""}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[14px] lg:text-[15px] text-[#282A2C] leading-[22px]">
                {t("paymentDeliveryInfo")}
              </p>
            </div>
          )}

          <div className="mt-[30px] lg:mt-[50px] mb-[36px] flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={toggleCart}
              className="bg-[#121212] text-white text-[14px] md:text-[15px] font-medium py-3 rounded-lg px-6 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors w-full sm:w-auto flex-1"
            >
              {isInCart ? (
                t("added")
              ) : (
                <>
                  <BackPlusIcons /> {t("addToCart")}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleLike}
              aria-pressed={isLiked}
              className="text-[#121212] bg-[#F4F4F4] text-[14px] md:text-[15px] font-medium py-3 rounded-lg px-6 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              <LikeIcons
                stroke={isLiked ? "red" : "black"}
                fill={isLiked ? "red" : "none"}
              />
              {t("like")}
            </button>
          </div>

          <button
            type="button"
            onClick={share}
            className="flex items-center gap-2 cursor-pointer bg-transparent"
          >
            <ShareIcons />
            <span className="text-[#121212] text-[13px] leading-[15px]">
              {t("share")}
            </span>
          </button>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-8 mt-60"
          columnClassName="flex flex-col gap-16"
        >
          {relatedProducts.map((e) => {
            const relatedImg = e.imgUrl?.path
              ? `${minio_img_url}${e.imgUrl.path}`
              : "";
            const relatedIsLiked = likes.some((l) => l.id === e.id);
            const relatedInCart = buskets.some((b) => b.id === e.id);
            return (
              <GlamCard
                key={e.id}
                className="colm1"
                url={`/glam/${e.id}?modelId=${encodeURIComponent(e.model?.title ?? "")}&color=${encodeURIComponent(e.color?.title ?? "")}&collectionId=${encodeURIComponent(e.collection?.title ?? "")}`}
                title={`${e.collection?.title ?? ""} ${e.model?.title ?? ""}`.trim()}
                type={e.sizeType ?? undefined}
                text={e.size?.title ?? ""}
                image={relatedImg}
                isLike={relatedIsLiked}
                onLike={() =>
                  dispatch(
                    relatedIsLiked
                      ? changeLike(likes.filter((it) => it.id !== e.id))
                      : changeLike([e, ...likes]),
                  )
                }
                onBuslet={() =>
                  dispatch(
                    relatedInCart
                      ? changeBuskets(buskets.filter((it) => it.id !== e.id))
                      : changeBuskets([e, ...buskets]),
                  )
                }
                isloading={undefined}
              />
            );
          })}
        </Masonry>
      )}
    </>
  );
}
