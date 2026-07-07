"use client";
import Back from "../components/back";
import GlamCard from "../components/glam-card";
import { BackPlusIcons, LikeIcons, ShareIcons, TelIcons } from "../components/icons";
import { Image as AntImage } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { changeBuskets, changeLike } from "@/lib/features";
import { minio_img_url } from "@/utils/divice";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import Masonry from "react-masonry-css";

export default function GlamById({ product, productArr, id }) {
  const t = useTranslations('Product');
  const [LocalId, setLocalId] = useState(id);
  const [type, setType] = useState(1);
  const [oneProduct, setOneProduct] = useState<any>();
  const { buskets } = useAppSelector((store) => store.buskets);
  const { likes } = useAppSelector((store) => store.likes);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setOneProduct(product?.find((e) => e?.id == LocalId));
  }, [product, LocalId]);

  const HendleLike = (e) => {
    dispatch(
      likes?.includes(e)
        ? changeLike(likes?.filter((itms) => itms?.id !== e?.id))
        : changeLike([e, ...likes])
    );
  };
  const HendleBusket = (e) => {
    dispatch(
      buskets?.includes(e)
        ? changeBuskets(buskets?.filter((itms) => itms?.id !== e?.id))
        : changeBuskets([e, ...buskets])
    );
  };
  const breakpointColumnsObj = {
    default: 4,
    // 1280: 4,
    1024: 3,
    768: 2,
    640: 2,
  };


  return (
    <>
      <div
        className={
          "flex flex-col lg:flex-row justify-start px-4 md:px-[30px] mt-[26px] gap-8 lg:gap-[35px] items-start"
        }
      >
        <div className="hidden lg:block">
          <Back />
        </div>
        <div className="flex flex-col-reverse lg:flex-row w-full gap-4 max-w-full lg:max-w-[620px]">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible w-full lg:w-[81px] pb-2 lg:pb-0 no-scrollbar">
            <Image
              src={oneProduct?.imgUrl?.path ? minio_img_url + oneProduct?.imgUrl?.path : ""}
              width={81}
              height={"100"}
              className="flex shrink-0 items-center object-contain  justify-center  w-[81px]  overflow-hidden rounded-md"
              alt={oneProduct?.model?.title || "Product thumbnail"}
            />
          </div>
          {oneProduct?.imgUrl ? (
            <div className="relative w-full flex items-center justify-center aspect-[6/4] lg:aspect-[4/4] lg:max-h-[740px] rounded-lg overflow-hidden bg-[#fcfcfc]">
              <AntImage
                src={oneProduct?.imgUrl?.path ? minio_img_url + oneProduct?.imgUrl?.path : ""}
                width={500}
                height={"100%"}
                className="object-contain w-full h-full"
                alt={oneProduct?.model?.title || "Product main image"}
              />
            </div>
          ) : (
            <div
              className={`flex items-center aspect-[3/4] sm:aspect-[2/3] w-full max-w-full lg:max-w-[500px] bg-[#F0F0E5] justify-center rounded-lg`}
            >
              <Image
                src={"/empty-folder.png"}
                width={60}
                height={60}
                alt="No image available"
              />
            </div>
          )}
        </div>
        <div className="w-full lg:max-w-[530px] mt-4 lg:mt-[20px]">
          <h4 className="text-[18px] lg:text-[24px] leading-[24px] lg:leading-[30px] text-wrap lg:text-nowrap text-[#282A2C] font-normal mb-2">
            {oneProduct?.model?.title}
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 gap-2">
            <h4 className="text-[28px] lg:text-[40px] leading-[34px] lg:leading-[50px] font-semibold text-[#282A2C]">
              {oneProduct?.collection?.title}
            </h4>
            <p className="text-[20px] lg:text-[24px] leading-[24px] lg:leading-[26px] font-medium text-[#212121]">
              {Number(oneProduct?.i_price).toLocaleString()} sum
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-[32px] lg:mb-[49px]">
            {product?.map((e, i) => (
              <p
                key={e?.id}
                onClick={() => setLocalId(e?.id)}
                className={`${e?.id == LocalId
                  ? "bg-[#212121] text-white"
                  : "bg-[#F4F4F4] text-[#212121] hover:bg-gray-200"
                  } px-3 py-2 cursor-pointer rounded-[5px] text-[14px] lg:text-[16px] transition-colors`}
              >
                {e?.size?.title}
              </p>
            ))}
          </div>
          <div className="w-full border-b-[1px] mb-[24px] lg:mb-[32px] relative flex">
            <p
              onClick={() => setType(1)}
              className={`${type == 1 ? "text-black border-black" : "text-gray-500 border-transparent opacity-70"
                } text-[15px] lg:text-[16px] font-medium inline-block px-4 py-3 border-b-2 transition-all cursor-pointer`}
            >
              {t('characteristics')}
            </p>
            <p
              onClick={() => setType(2)}
              className={`${type == 2 ? "text-black border-black" : "text-gray-500 border-transparent opacity-70"
                } text-[15px] lg:text-[16px] font-medium inline-block px-4 py-3 border-b-2 transition-all cursor-pointer`}
            >
              {t('paymentAndDelivery')}
            </p>
          </div>
          {type == 1 ? (
            <div >
              <p className="text-[14px] lg:text-[15px] text-[#282A2C] leading-[22px] whitespace-pre-line">
                {oneProduct?.internetInfo}
              </p>
            </div>
          ) : (
            <div >
              <p className="text-[14px] lg:text-[15px] text-[#282A2C] leading-[22px]">
                {t('paymentDeliveryInfo')}
              </p>
            </div>
          )}

          <div className="mt-[30px] lg:mt-[50px] mb-[36px] flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => HendleBusket(oneProduct)}
              className="bg-[#121212] text-white text-[14px] md:text-[15px] font-medium py-3 rounded-lg px-6 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors w-full sm:w-auto flex-1"
            >
              {buskets?.map((it) => it?.id)?.includes(oneProduct?.id) ? (
                t('added')
              ) : (
                <>
                  <BackPlusIcons /> {t('addToCart')}
                </>
              )}
            </button>

            <button
              onClick={() => HendleLike(oneProduct)}
              className="text-[#121212] bg-[#F4F4F4] text-[14px] md:text-[15px] font-medium py-3  rounded-lg px-6 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              <LikeIcons
                stroke={
                  likes?.map((it) => it?.id)?.includes(oneProduct?.id)
                    ? "red"
                    : "black"
                }
                fill={
                  likes?.map((it) => it?.id)?.includes(oneProduct?.id)
                    ? "red"
                    : "none"
                }
              />
              {t('like')}
            </button>
          </div>

          <div
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Ссылка скопирована!");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ShareIcons />
            <p className="text-[#121212]   text-[13px] leading-[15px]">
              {t('share')}
            </p>
          </div>
        </div>

      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-8 mt-60"
        columnClassName="flex flex-col gap-16"
      >
        {productArr?.length ? productArr?.map((e) => (
          <GlamCard
            key={e?.id}
            className="colm1"
            url={`/glam/${e?.id}?modelId=${e?.model?.title}&color=${e?.color?.title}&collectionId=${e?.collection?.title}`}
            title={`${e?.collection?.title} ${e?.model?.title}`}
            type={e?.sizeType}
            text={e?.size?.title}
            image={e?.imgUrl?.path ? minio_img_url + e?.imgUrl?.path : ""}
            isLike={likes?.map((it: any) => it?.id)?.includes(e?.id)}
            onLike={() => {
              dispatch(
                likes?.some((itms: any) => itms?.id === e?.id)
                  ? changeLike(likes?.filter((itms: any) => itms?.id !== e?.id))
                  : changeLike([e, ...likes])
              );
            }}
            onBuslet={() => {
              dispatch(
                buskets?.some((itms: any) => itms?.id === e?.id)
                  ? changeBuskets(
                    buskets?.filter((itms: any) => itms?.id !== e?.id)
                  )
                  : changeBuskets([e, ...buskets])
              );
            }}
            isloading={undefined}
          />
        )) : ""}
      </Masonry>
    </>
  );
}
