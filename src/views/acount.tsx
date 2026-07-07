"use client";
import ChnagePhone from "@/components/change-phone";
import { EditIcons } from "@/components/icons";
import { changeUserMe } from "@/lib/features";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getDetailedDeviceName } from "@/utils/divice";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AcountPage() {
  const [openChnagePhone, setOpenChnagePhone] = useState(false);
  const { userMe } = useAppSelector((store) => store.userMe);
  const { token } = useAppSelector((store) => store.token);
  const [device, setDevice] = useState<{ ip?: string; device?: string }>({});
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setFirstName(userMe?.firstName);
    setLastName(userMe?.lastName);
  }, [userMe]);
  useEffect(() => {
    const getDeviceInfo = async () => {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();

      const device = getDetailedDeviceName();

      setDevice({
        ip: data.ip,
        device,
      });
    };

    getDeviceInfo();
  }, []);
  const ChageData = async () => {
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_URL}/user/client/`, {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          firstName,
          lastName,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          dispatch(changeUserMe({ ...userMe, ...res }));
          setFirstName(res?.firstName);
          setLastName(res?.lastName);
          toast("успешно");
        });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <h4 className="text-[24px] md:text-[44px] leading-[28px] md:leading-[51px] mt-3 md:mb-[13px] mb-[14px]">
        id:{userMe?.login}
      </h4>
      {openChnagePhone ? (
        <ChnagePhone onSuccess={() => setOpenChnagePhone(false)} />
      ) : (
        ""
      )}
      <div className="flex items-center gap-[21px]">
        <p className="text-[22px] leading-[25px]">{userMe?.phone}</p>
        <span onClick={() => setOpenChnagePhone(true)}>
          <EditIcons />
        </span>
        <p className="text-[#212121] opacity-30 text-[12px] leading-[18px]">
          подтержден
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 max-w-[596px] mt-[41px] mb-[48px]">
        <div className="w-full">
          <p className="mb-2 text-[14px] leading-[16px]">Имя</p>

          <input
            value={firstName || ""}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Имя"
            className="py-[11px] w-full px-[12px] outline-none border"
          />
        </div>
        <div className="w-full">
          <p className="mb-2 text-[14px] leading-[16px]">Фамилия</p>

          <input
            value={lastName || ""}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Фамилия"
            className="py-[11px] w-full px-[12px] outline-none border"
          />
        </div>
        <button
          onClick={ChageData}
          disabled={loading}
          className="bg-black h-12 text-white px-[40px] w-full sm:w-auto flex-shrink-0"
        >
          {loading ? "Проверка..." : "Подтвердить"}
        </button>
      </div>
      <p className="text-[14px] leading-[20px] text-[#212121]">ip device: </p>
      <p className="text-[14px] leading-[20px] text-[#212121] opacity-40">
        {device?.ip} {device?.device}
      </p>
      {/* <p className='text-[14px] leading-[20px] text-[#212121] mt-5'>location registry:  </p>
          <p className='text-[14px] leading-[20px] text-[#212121] opacity-40'>c.Tashkent. str.Yuganik l:892423 sh:29832</p> */}

      <p className="mt-[50px] w-full text-[#21212173]  max-w-[474px] text-[12px] leading-[15px]">
        <p className="mb-[10px]">
          Регистрируясь на нашем сайте, вы подтверждаете свое согласие с нашей
          <span className="font-medium text-[#349AFF]">
            Политикой конфиденциальности
          </span>
          и
          <span className="font-medium text-[#349AFF]">
            Условиями использования.
          </span>
        </p>
        Эти документы содержат важную информацию о том, как мы защищаем ваши
        персональные данные, обрабатываем информацию и регулируем использование
        нашего сервиса. Мы рекомендуем вам внимательно ознакомиться с ними перед
        завершением регистрации, чтобы быть уверенными в прозрачности и
        безопасности нашего взаимодействия. Ваше доверие и защита ваших данных
        для нас приоритетны!
      </p>
    </div>
  );
}
