"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { changeBuskets } from "../lib/features";
import GlamCardBusket from "../components/gllam-card-busket";
import { useRouter } from "@/i18n/routing";
import SignInModal from "@/components/sign-in";
import { formatUzPhone } from "@/lib/formatUzPhone";
import { minio_img_url } from "@/utils/divice";

export default function BusketPage() {
  const { buskets } = useAppSelector((store) => store.buskets);
  const { userMe } = useAppSelector((store) => store.userMe);
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState("+998");
  const [openAuth, setOpenAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userMe?.phone) {
      setPhone(userMe?.phone);
    }
  }, [userMe]);
  const HendleRemove = (e) => {
    dispatch(changeBuskets(buskets?.filter((itms) => itms?.id !== e?.id)));
  };

  const HandleCount = (e, count) => {
    dispatch(changeBuskets(buskets?.map((itms) => itms?.id === e?.id ? { ...itms, count: count } : itms)));
  };

  console.log(buskets)
  return (
    <div className="w-full max-w-[1100px] md:gap-[20px] gap-3 items-start flex flex-col lg:flex-row xl:flex-nowrap justify-between md:px-4 sm:px-0">
      <div className="w-full">
        {buskets?.length
          ? buskets?.map((e) => (
            <GlamCardBusket
              key={e?.id}
              // url={`/glam/${e?.id}?modelId=${e?.model?.title}&color=${e?.color?.title}&collectionId=${e?.collection?.title}`}
              title={`${e?.collection?.title} ${e?.model?.title}`}
              items={e}
              image={e?.imgUrl?.path ? minio_img_url + e?.imgUrl?.path : ""}
              onRemove={() => HendleRemove(e)}
              onCountChange={(count) => HandleCount(e, count)}
              isMyOrder={undefined}
              price={undefined} />
          ))
          : ""}
      </div>
      <div className="w-full sm:max-w-[270px] flex-shrink-0">
        <p className="text-[12px] leading-[14.4px] text-[#212121]">Заказчик</p>
        <p className="text-[20px] leading-[23.4px] text-[#212121] mt-[6px] mb-[24px]">
          {userMe ? userMe?.login : "Не ригистрирован"}
        </p>

        <div className="items-center w-full mb-2 flex justify-between">
          <p className="text-[12px] leading-[14.4px] text-[#212121]">
            Номер для связи
          </p>
          {/* <p className="text-[12px] leading-[14.4px] text-[#006BD6]">
            Изменить
          </p> */}
        </div>

        <input
          value={phone}
          onChange={(e) => setPhone(formatUzPhone(e.target.value))}
          placeholder="+998"
          disabled={userMe?.phone}
          className="py-[11px] w-full px-[12px] outline-none border-[#EEEEEE] border-[1px] border-solid"
        />
        <button
          onClick={
            phone && buskets?.length
              ? () => {
                userMe?.phone
                  ? router.push(`/order?phone=${phone}`)
                  : setOpenAuth(true);
              }
              : () => { }
          }
          disabled={!phone}
          className={`${phone && buskets?.length
            ? "bg-black text-white"
            : "border-[#EEEEEE] border-[1px] border-solid"
            } py-[11px] cursor-pointer text-center inline-block w-full mt-[30px]  px-[12px] `}
        >
          Оформить заказ
        </button>
      </div>

      {openAuth ? <SignInModal cosomPhone={phone} onSuccess={() => {
        setOpenAuth(false)
        router.push(`/order?phone=${phone}`)
      }} /> : ""}
    </div>
  );
}
