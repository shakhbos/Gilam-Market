import Image from "next/image";
import React, { useState } from "react";
import { CloseIcons, MinutIcons, PlusIcons } from "./icons";


export default function GlamCardBusket({ isMyOrder, myCount = 1, price, title, onRemove, items, image, onCountChange }) {
  const [count, setCount] = useState(items?.isMetric ? items?.size?.y * 100 : items?.count || 1);
  return (
    <div className="flex flex-col w-full  relative sm:flex-row sm:flex-nowrap border-[1px] flex-wrap  md:mb-[30px] mb-[15px] p-[2px]  border-[#EEEEEE] items-start gap-[12px] sm:gap-[24px]">
      {image ? (
        <div className="w-full w-[114px]  md:w-[274px] md:h-auto aspect-[174/256] relative">
          <Image src={image} alt={"img"} title={title} fill className="object-cover" />
        </div>
      ) : <div
        className={`  flex items-center h-[256px] w-[174px]  bg-[#F0F0E5] justify-center `}
      >
        <Image src={"/empty-folder.png"} width={60} height={60} alt="img" />
      </div>}

      {onRemove ? <div onClick={onRemove} className="ms-auto -mx-1.5 cursor-pointer absolute top-4 right-4 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
        <CloseIcons />
      </div> : ""}
      <div className="w-full px-2 sm:px-0">
        <div className="flex flex-wrap md:py-[30px] md:border-b-[1px] py-[15px]">
          <div className="w-1/2 sm:w-1/4 mr-[4px]">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Коллекция
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              {items?.collection?.title}
            </p>

          </div>
          <div className="w-1/2 sm:w-1/4">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Модель
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              {items?.model?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/5 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Размер
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              {items?.size?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Цена за м²
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              {items?.i_price} sum
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Цвет
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              {items?.color?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Стиль
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              {items?.style?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Форма
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              {items?.shape?.title}
            </p>
          </div>
          <div className="w-1/2 sm:w-1/4 md:mt-4 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Страна
            </h3>
            <p className="text-[16px] text-nowrap  leading-[19px] text-[#282A2C] mb-1 ">
              {items?.country?.title}
            </p>
          </div>
        </div>
        <div className="flex justify-between  sm:flex-nowrap flex-wrap w-full items-center py-[25px] md:gap-[19px]">
          {!isMyOrder ? <div className="flex  w-full sm:w-1/3 gap-[2px]">
            {items?.isMetric ? (
              <input
                type="number"
                value={count}
                onChange={(e) => {
                  let val = parseFloat(e.target.value);
                  const maxVal = items?.size?.y * 100 || 100; // Fallback if size.y is missing
                  if (val > maxVal) val = maxVal;
                  if (val < 0) val = 0;
                  setCount(val);
                  onCountChange && onCountChange(val / 100);
                }}
                className="w-full sm:w-[100px] px-3 py-2 border-[1px] border-[#EEEEEE] text-[14px] outline-none"
              />
            ) : (
              <>
                <div
                  className={`${count == 1
                    ? "opacity-40 cursor-not-allowed"
                    : " hover:bg-[#EEEEEE] active:bg-white cursor-pointer"
                    }  p-2  border-[1px] border-[#EEEEEE] `}
                  onClick={count > 1 ? () => {
                    setCount(count - 1);
                    onCountChange && onCountChange(count - 1);
                  } : () => { }}
                >
                  <MinutIcons />
                </div>
                <div className="px-3 pb-[6px] pt-[10px] border-[1px]  border-[#EEEEEE]  text-[14px] leading-[16px] text-medium">
                  {count}
                </div>
                <div
                  className={`${9 == count
                    ? "opacity-40 cursor-not-allowed"
                    : " hover:bg-[#EEEEEE] active:bg-white cursor-pointer"
                    }  p-2  border-[1px] border-[#EEEEEE] hover:bg-[#EEEEEE] active:bg-white`}
                  onClick={() => {
                    if (9 > count) {
                      setCount(count + 1);
                      onCountChange && onCountChange(count + 1);
                    }
                  }}
                >
                  <PlusIcons />
                </div>
              </>
            )}
          </div> : <div className="w-1/2 sm:w-1/3">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Количество
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              {myCount}
            </p>
          </div>}

          <div className="w-1/2 sm:w-1/3">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Скидка
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              0%
            </p>
          </div>
          <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
            <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
              Итого
            </h3>
            <p className="text-[16px]  leading-[19px] text-[#282A2C] mb-1 ">
              {(items?.i_price * count * (items?.isMetric ? items?.size?.x : items?.size?.kv)).toFixed(2)} sum
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
