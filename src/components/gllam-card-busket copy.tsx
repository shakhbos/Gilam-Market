import Image from "next/image";
import React, { useState } from "react";
import { MinutIcons, PlusIcons, RoundedIcons, SomeThingIcons } from "./icons";

export default function GlamCardBusket({ title, image }) {
  const [count, setCount] = useState(1);
  return (
    <div className="flex sm:flex-nowrap relative flex-wrap justify-center w-full mb-[30px] pb-[30px] border-b-[1px] border-[#EEEEEE] items-start gap-[24px]">
      {image && (
        <Image src={image} alt={"img"} title={title} width={174} height={256} />
      )}

    
      <div className="w-full max-w-[360px] mt-[10px]">
        <div className="flex items-center justify-between ">
          <h3 className="text-[#282A2C] text-[24px] leading-[30px]">3667</h3>
          <p className="text-[#212121] text-[12px] leading-[14px]">
            Характеристика ковра
          </p>
        </div>
        <h3 className="text-[#282A2C] text-[32px] leading-[40px] mt-[2px] mb-[12px]">
          Aspendos
        </h3>

        <div className="flex sm:flex-nowrap flex-wrap w-full items-center gap-1">
          <div className="text-[#FFFFFF] bg-[#212121] rounded-[5px] py-1 px-2">
            100X150
          </div>
          <div className="text-[#FFFFFF] bg-[#212121] rounded-[5px] py-1 px-2">
            Blue
          </div>
          <div className="text-[#FFFFFF] bg-[#212121] rounded-[5px] py-1 px-2">
            Hi-tech
          </div>
        </div>
        <div className="flex sm:flex-nowrap flex-wrap w-full items-center mt-[43px] gap-[19px]">
          <div className="flex w-full max-w-[140px] border-[1px] border-[#EEEEEE] ">
            <div
              className={`${
                count == 6
                  ? "opacity-40 cursor-not-allowed"
                  : " hover:bg-[#EEEEEE] active:bg-white cursor-pointer"
              }  p-3 pr-[15px] `}
              onClick={() => setCount(count + 1)}
            >
              <PlusIcons />
            </div>
            <div className="px-4 py-3 border-x-[1px] border-[#EEEEEE]  text-[18px] leading-[22px] text-medium">
              {count}
            </div>
            <div
              className={`${
                count == 1
                  ? "opacity-40 cursor-not-allowed"
                  : " hover:bg-[#EEEEEE] active:bg-white cursor-pointer"
              } cursor-pointer p-3 pl-[15px] hover:bg-[#EEEEEE] active:bg-white`}
              onClick={count > 1 ? () => setCount(count - 1) : () => {}}
            >
              <MinutIcons />
            </div>
          </div>
          <div className="bg-[#FFA500] flex  items-center gap-3 p-3 pr-[18px] rounded-[2px] relative">
            <div className="absolute -top-[20px] -left-[9px]">
              {" "}
              <SomeThingIcons />
            </div>
            <RoundedIcons />
            <p className="text-[#FFFFFF] text-[17px] leading-[21px] font-bold">
              {120000000 * count} uzs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
