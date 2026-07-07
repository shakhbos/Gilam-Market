"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import Container from "@/components/container";
import Back from "@/components/back";
import Image from "next/image";
import InputCostom from "@/components/form/input";
import SelectCostom from "@/components/form/select";
import { DatePicker, TimePicker } from "antd";
import { toast } from "react-toastify";
import OrderModal from "@/components/order-modal";
import { changeBuskets } from "@/lib/features";
import LocationModal from "@/components/LocationModal";

const typePayArr = ["cash", "payme", "click"] as const;
type PaymentKey = (typeof typePayArr)[number];

const paymentMap: Record<PaymentKey, string> = {
  cash: "IN_HAND",
  payme: "PAYME",
  click: "CLICK",
};

interface OrderLocation {
  address?: string;
  lat?: number;
  lng?: number;
}

export default function OrderPage() {
  const { buskets } = useAppSelector((store) => store.buskets);
  const { userMe } = useAppSelector((store) => store.userMe);
  const [openMadal, setOpenMadal] = useState(false)
  const dispatch = useAppDispatch();
  const [typePay, setTypePay] = useState<PaymentKey>("cash");
  const [comment, setComment] = useState("");

  const [orderDate, setOrderDate] = useState<any>(null);
  const [orderTime, setOrderTime] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<OrderLocation | null>(null);

  const buildOrderBody = () => {
    let combinedDate: string | null = null;

    if (orderDate) {
      combinedDate = orderDate.format("YYYY.MM.DD");
      if (orderTime) {
        combinedDate = `${combinedDate} ${orderTime.format("HH:mm")}`;
      }
    }

    const locationLink =
      location?.lat != null && location?.lng != null
        ? `https://yandex.com/maps/?pt=${location.lng},${location.lat}&z=17&l=map`
        : undefined;

    return {
      client_order_items: buskets.map((item) => ({
        product: item.id,
        count: item?.count || 1,
      })),
      payment_type: paymentMap[typePay],
      delivery_comment: comment,
      full_address: location?.address,
      location_link: locationLink,
      date: combinedDate,
      user: userMe?.id,
    };
  };

  // 🚀 Submit order
  const submitOrder = async () => {
    if (!buskets.length || !userMe?.id) return;

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/client-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildOrderBody()),
      });

      if (!res.ok) throw new Error("Order failed");

      const data = await res.json();
      if (data) {
        setOpenMadal(true)
        dispatch(
          changeBuskets([])
        );
      }
    } catch (err) {
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container
      className={
        "flex flex-wrap md:flex-nowrap px-[26px]  mt-[26px] gap-[35px] items-center"
      }
    >
      <Back />
      <div className="mt-[14px] w-full">
        <h3 className="mb-[30px] md:mb-[71px] inline-block text-[22px] leading-[25px]">
          Корзина | Оформления заказа
        </h3>
        <div className="flex mb-[100px] flex-col-reverse md:flex-row gap-[20px] lg:gap-[60px] w-full">
          <div className="w-full flex flex-col gap-5 md:inline-block md:max-w-[205px]">
            <h4 className="text-[14px] leading-[16px] font-medium">
              Об оформления
            </h4>
            <p className="mt-[12px] text-[12px] mb-[40px] leading-[14px]">
              После оформления заказа появится окно с подтверждением успешного
              оформления и чеком вашего заказа. Также заказ будет доступен в
              разделе "Мои покупки", где вы сможете найти его номер для
              уточнения статуса у оператора.
            </p>
            <h4 className="text-[14px] leading-[16px] font-medium">
              Предоплата
            </h4>
            <p className="mt-[12px] text-[12px] mb-[10px] leading-[14px]">
              Если для онлайн-заказа выбрана оплата наличными, потребуется
              предоплата для подтверждения заказа.
            </p>
            <p className="mt-[12px] text-[12px] mb-[40px] leading-[14px]">
              После оформления заказа и получения его номера свяжитесь с
              оператором для уточнения деталей оплаты. Для информации
              обращайтесь к оператору!
            </p>
            <p className="mt-[12px] text-[12px] leading-[14px] opacity-45 mb-[20px]">
              Для связи с модератором по вопросам оформления заказов звоните по
              номеру или пишите в telegram:
            </p>

            <a
              className="text-[12px] w-full inline-block mb-[6px] leading-[14px] font-medium"
              href="tel:+998991404422"
            >
              +998 90 000-00-00
            </a>
            <a
              className="text-[12px] w-full inline-block  leading-[14px] font-medium"
              target="_blank"
            >
              @t.me/username
            </a>
          </div>
          <div className="w-full max-w-[1100px] flex flex-col lg:flex-row gap-[20px] items-start justify-between">
            <div className="w-full ">
              <div className="p-[30px] rounded-[3px] border-[#EEEEEE] border-[1px] mb-2">
                <p className="text-[12px] leading-[14px] mb-[15px]">
                  Список выбранные вами заказов
                </p>
                <ul className="max-h-[300px] overflow-y-auto pr-2">
                  {buskets.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap sm:flex-nowrap gap-2 border p-2 mb-1 text-[12px]"
                    >
                      <p className="w-1/2 sm:w-full">{item?.collection?.title}</p>
                      <p className="w-1/2 sm:w-full">{item?.model?.title}</p>
                      <p className="w-1/2 sm:w-full">{item?.size?.title}</p>
                      <p className="w-1/2 sm:w-full">{item?.color?.title}</p>
                      <p className="w-1/2 sm:w-full">{item?.shape?.title}</p>
                      <p className="w-1/2 sm:w-full">{item?.style?.title}</p>
                      <p className="w-1/2 sm:w-full">{item?.count || 1} {item?.isMetric ? "м" : "x"} </p>
                      <p className="w-1/2 sm:w-full"> {(item?.i_price * (item?.count || 1) * (item?.isMetric ? item?.size?.x : item?.size?.kv)).toFixed(2)} sum</p>
                    </div>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-[15px] mt-[24px] justify-end">
                  <h4 className="font-medium text-[16px] leading-[18px] text-[#212121] ">
                    Итоговое сумма:
                  </h4>
                  <h4 className="font-medium text-[16px] leading-[18px] text-[#212121] ">
                    {buskets.reduce((acc, item) => acc + (item?.i_price * (item?.count || 1) * (item?.isMetric ? item?.size?.x : item?.size?.kv)), 0).toFixed(2)} сум
                  </h4>
                </div>
              </div>
              <div className="p-[30px] rounded-[3px] border-[#EEEEEE] border-[1px] mb-2">
                <p className="text-[12px] leading-[14px] mb-[15px]">
                  Укажите метод оплаты
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  {typePayArr.map((e, i) => (
                    <div
                      key={e}
                      onClick={() => setTypePay(e)}
                      className={`cursor-pointer flex items-center gap-2 border p-3 w-full ${"cash" === e ? "" : "opacity-40"
                        }`}
                    >
                      <div className="w-[16px] h-[16px] border rounded-full flex items-center justify-center">
                        {typePay === e && (
                          <div className="w-[10px] h-[10px] bg-black rounded-full" />
                        )}
                      </div>
                      <p className="mr-auto text-[12px]">{e}</p>
                      <Image
                        src={`/pay${i + 1}.png`}
                        width={40}
                        height={25}
                        alt="pay"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[12px] leading-[18px] text-[#212121] opacity-50">
                  После выбора способа оплаты: вы обязаны оплатить заказ по
                  указанному методу. Торговаться или изменять условия оплаты,
                  включая наличный способ, нельзя. Вы должны внести полную
                  сумму, указанную в итоговой цене.
                </p>
              </div>
              <div className="p-[30px] rounded-[3px] border-[#EEEEEE] border-[1px] mb-2">
                <InputCostom

                  placeholder={"Введите промокод"}
                  label={"Промокод"}
                />

                <p className="text-[12px] leading-[18px] text-[#212121] opacity-50">
                  Если у вас есть промокод, введите его здесь и получите скидку!
                </p>
              </div>
              <div className="p-[30px] rounded-[3px] border-[#EEEEEE] border-[1px] mb-6">
                <div className="flex flex-col gap-2 flex-wrap">

                  <InputCostom
                    className={"colm2 w-full"}
                    placeholder={"Улица, дом, ориентир, номер квартиры"}
                    required={true}
                    value={location?.address || ""}
                  // onChange={(e) => setAddress(e.target.value)}
                  />

                  <LocationModal location={location} setLocation={setLocation} />
                </div>
                <p className="text-[12px] leading-[18px] text-[#212121] opacity-50">
                  Убедитесь, что указали правильный адрес доставки. После
                  оформления заказа изменить адрес будет невозможно. В случае
                  ошибки в адресе, вам придется оплатить дополнительные
                  курьерские услуги. Пожалуйста, не забудьте встретить курьера
                  во дворе!
                </p>
                <p className="text-[12px] leading-[14px] mt-[30px] mb-[15px]">
                  Дата для получения доставки (не обязательно)
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <div className="flex-1 w-full">
                    <label className="text-[12px] mb-1 block">Дата доставки</label>
                    <DatePicker
                      value={orderDate}
                      className=" w-full  outline-none  rounded-none border-solid h-12"
                      onChange={(date) => setOrderDate(date)}
                      format="YYYY-MM-DD"

                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-[12px] mb-1 block">Время доставки</label>
                    <TimePicker
                      value={orderTime}
                      onChange={(time) => setOrderTime(time)}
                      format="HH:mm"
                      className=" w-full  outline-none  rounded-none border-solid h-12"
                    />
                  </div>
                </div>
                <p className="text-[12px] leading-[18px] text-[#212121] opacity-50">
                  Если у вас нет времени получить доставку в любое время, вы
                  можете настроить удобное время получения вашего заказа!
                </p>
              </div>
              <p className="text-[12px] leading-[14px] mb-[12px]">
                Комментарий для курьера
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border mb-6"
                rows={3}
                placeholder="Комментарий для курьера"
              />

              <button
                onClick={loading ? () => { } : submitOrder}
                className="py-[11px] w-full mb-[59px] bg-[#212121] text-white text-center inline-block  px-[12px] border-[#EEEEEE] border-[1px] border-solid"
              >
                {loading ? "Оформление..." : "Оформить заказ"}
              </button>
            </div>
            <div className="w-full max-w-[270px]">
              <p className="text-[12px] leading-[14.4px] text-[#212121]">
                Заказчик
              </p>
              <p className="text-[20px] leading-[23.4px] text-[#212121] mt-[6px] mb-[24px]">
                id:{userMe?.login}
              </p>

              <div className="items-center w-full mb-2 flex justify-between">
                <p className="text-[12px] leading-[14.4px] text-[#212121]">
                  Номер для связи
                </p>
                <p className="text-[12px] leading-[14.4px] text-[#006BD6]">
                  Изменить
                </p>
              </div>

              <p className="py-[11px] w-full px-[12px] outline-none border-[#EEEEEE] border-[1px] border-solid">
                {userMe?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
      {openMadal && <OrderModal />}
    </Container>
  );
}
