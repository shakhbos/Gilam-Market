"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { CloseIcons, MinutIcons, PlusIcons } from "./icons";

interface Props {
  isMyOrder?: boolean;
  myCount?: number;
  price?: number | string;
  title: string;
  onRemove?: () => void;
  items: any;
  image?: string;
  onCountChange?: (v: number) => void;
}

/**
 * Savatcha va Buyurtmalarim ro'yxatining bitta kartochkasi. Miqdor
 * kapitulyatsiyasi (max) — QrBase javobidagi `total_count` (metric bo'lmagan
 * mahsulotlar) yoki size.y*100 (metric).
 */
export default function GlamCardBusket({
  isMyOrder,
  myCount = 1,
  title,
  onRemove,
  items,
  image,
  onCountChange,
}: Props) {
  const t = useTranslations("Basket");
  const isMetric = !!items?.isMetric;
  const stockMax = isMetric
    ? Math.max(Math.round((items?.size?.y || 0) * 100), 1)
    : Math.max(Number(items?.total_count ?? 0), 0);
  const initial = isMetric
    ? Math.round((items?.size?.y || 0) * 100)
    : Math.max(1, Number(items?.count) || 1);
  const [count, setCount] = useState(Math.min(initial, Math.max(stockMax, 1)));

  const canIncrement = !isMetric && count < stockMax;
  const canDecrement = !isMetric && count > 1;

  const bumpTo = (next: number) => {
    if (next < 1) return;
    if (next > stockMax) {
      toast.error(t("stockLimit"));
      return;
    }
    setCount(next);
    onCountChange?.(next);
  };

  return (
    <div className="flex flex-col w-full relative sm:flex-row sm:flex-nowrap border-[1px] flex-wrap md:mb-[30px] mb-[15px] p-[2px] border-[#EEEEEE] items-start gap-[12px] sm:gap-[24px]">
      {image ? (
        <div className="w-full w-[114px] md:w-[274px] md:h-auto aspect-[174/256] relative">
          <Image src={image} alt="img" title={title} fill className="object-cover" />
        </div>
      ) : (
        <div className="flex items-center h-[256px] w-[174px] bg-[#F0F0E5] justify-center">
          <Image src="/empty-folder.png" width={60} height={60} alt="img" />
        </div>
      )}

      {onRemove ? (
        <div
          onClick={onRemove}
          className="ms-auto -mx-1.5 cursor-pointer absolute top-4 right-4 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
          aria-label="Close"
        >
          <CloseIcons />
        </div>
      ) : null}

      <div className="w-full px-2 sm:px-0">
        <div className="flex flex-wrap md:py-[30px] md:border-b-[1px] py-[15px]">
          <div className="w-1/2 sm:w-1/4 mr-[4px]">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("collection")}
            </h3>
            <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">
              {items?.collection?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("model")}
            </h3>
            <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">
              {items?.model?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/5 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("size")}
            </h3>
            <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">
              {items?.size?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("pricePerM2")}
            </h3>
            <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">
              {items?.i_price} sum
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("color")}
            </h3>
            <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">
              {items?.color?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("style")}
            </h3>
            <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">
              {items?.style?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("shape")}
            </h3>
            <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">
              {items?.shape?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("country")}
            </h3>
            <p className="text-[16px] text-nowrap leading-[19px] text-[#282A2C] mb-1">
              {items?.country?.title}
            </p>
          </div>
        </div>

        <div className="flex justify-between sm:flex-nowrap flex-wrap w-full items-center py-[25px] md:gap-[19px]">
          {!isMyOrder ? (
            <div className="flex w-full sm:w-1/3 gap-[2px]">
              {isMetric ? (
                <input
                  type="number"
                  value={count}
                  onChange={(e) => {
                    let val = parseFloat(e.target.value);
                    if (Number.isNaN(val)) val = 0;
                    if (val > stockMax) {
                      val = stockMax;
                      toast.error(t("stockLimit"));
                    }
                    if (val < 0) val = 0;
                    setCount(val);
                    onCountChange?.(val / 100);
                  }}
                  max={stockMax}
                  className="w-full sm:w-[100px] px-3 py-2 border-[1px] border-[#EEEEEE] text-[14px] outline-none"
                />
              ) : (
                <>
                  <div
                    className={`${
                      canDecrement
                        ? "hover:bg-[#EEEEEE] active:bg-white cursor-pointer"
                        : "opacity-40 cursor-not-allowed"
                    } p-2 border-[1px] border-[#EEEEEE]`}
                    onClick={() => canDecrement && bumpTo(count - 1)}
                  >
                    <MinutIcons />
                  </div>
                  <div className="px-3 pb-[6px] pt-[10px] border-[1px] border-[#EEEEEE] text-[14px] leading-[16px] text-medium">
                    {count}
                  </div>
                  <div
                    className={`${
                      canIncrement
                        ? "hover:bg-[#EEEEEE] active:bg-white cursor-pointer"
                        : "opacity-40 cursor-not-allowed"
                    } p-2 border-[1px] border-[#EEEEEE]`}
                    onClick={() => canIncrement && bumpTo(count + 1)}
                  >
                    <PlusIcons />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-1/2 sm:w-1/3">
              <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
                {t("quantity")}
              </h3>
              <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">
                {myCount}
              </p>
            </div>
          )}

          <div className="w-1/2 sm:w-1/3">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("discount")}
            </h3>
            <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">0%</p>
          </div>
          <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              {t("total")}
            </h3>
            <p className="text-[16px] leading-[19px] text-[#282A2C] mb-1">
              {(
                (Number(items?.i_price) || 0) *
                count *
                (isMetric ? Number(items?.size?.x) || 0 : Number(items?.size?.kv) || 0)
              ).toFixed(2)}{" "}
              sum
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
