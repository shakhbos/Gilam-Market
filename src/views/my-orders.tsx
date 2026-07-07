"use client";
import { useAppSelector } from "@/lib/hooks";
import { fetchData } from "@/service/get";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import GlamCardBusket from "@/components/gllam-card-busket";
import { minio_img_url } from "@/utils/divice";


function HeaderItem({ title, value }) {
  return (
    <div className="w-full">
      <h3 className="text-[12px] leading-[14px] text-[#282A2C] mb-1 opacity-45">
        {title}
      </h3>
      <p className="text-[14px]  leading-[19px] text-[#282A2C] mb-1 ">

        {value}
      </p>
    </div>
  )
}
export default function MyOrdersPage() {
  const { token } = useAppSelector((store) => store.token);
  const [myOrder, setMyOrder] = useState<any>([]);
  useEffect(() => {
    if (!token) return;

    const getMyOrders = async () => {
      try {
        const response = await fetchData(
          `${process.env.NEXT_PUBLIC_URL}/client-orders/for-client`,
          {
            token,
            limit: 20,
          }
        );
        setMyOrder(response);
      } catch (error) {
        console.error(error);
      }
    };

    getMyOrders();
  }, [token]);

  return (
    <div className="w-full max-w-[1100px] gap-[20px] items-start flex flex-col-reverse lg:flex-row xl:flex-nowrap justify-between md:px-4 sm:px-0">
      <div className="w-full ">
        {myOrder?.items?.map((item) => (
          <div key={item?.id}>
            <p className="text-[12px] text-[#212121]/45">
              {" "}
              {dayjs(item?.startDate)?.format("DD MMMM YYYY HH:mm")}
            </p>
            <div className="flex px-[14px] py-[10px] gap-4 sm:gap-1 border-[#EEEEEE] my-[10px] border overflow-x-auto scrollbar-hide">
              <div className="min-w-[100px] w-full"><HeaderItem title="Номер заказа" value={"№" + item?.sequence} /></div>
              <div className="min-w-[100px] w-full"><HeaderItem title="Статус заказа" value={item?.order_status} /></div>
              <div className="min-w-[120px] w-full"><HeaderItem title="Дата доставки" value={item?.date} /></div>
              <div className="min-w-[100px] w-full"><HeaderItem title="Предоплата" value={item?.pre_payment} /></div>
              <div className="min-w-[100px] w-full"><HeaderItem title="Осталось" value={Number(item?.totalPrice) - Number(item?.pre_payment)} /></div>
            </div>
            {item?.client_order_items?.length
              ? item?.client_order_items?.map((e) => (
                <GlamCardBusket
                  key={e?.id}
                  isMyOrder
                  myCount={e?.count}
                  price={e?.price}
                  title={`${e?.collection?.title} ${e?.model?.title}`}
                  items={e?.product}
                  image={e?.product?.imgUrl?.path ? minio_img_url + e?.product?.imgUrl?.path : ""} onRemove={undefined} onCountChange={undefined} />
              ))
              : ""}
          </div>
        ))}
        {/*  */}
      </div>
      <div className="w-full sm:max-w-[270px]">
        <p className="text-[20px] leading-[23.4px] text-[#212121] font-bold mb-[15px]">
          Для уточнений
        </p>
        <p className="text-[12px] leading-[14.4px] text-[#212121]">
          Если вы хотите узнать подробности о вашем заказе, свяжитесь с нашими
          операторами по телефону.
        </p>
      </div>
    </div>
  );
}
