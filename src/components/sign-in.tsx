"use client";
import { changeToken } from "../lib/features";
import { formatUzPhone } from "../lib/formatUzPhone";
import { useAppDispatch } from "../lib/hooks";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface SignInModalProps {
  cosomPhone?: string;
  onSuccess?: () => void;
}

export default function SignInModal({ cosomPhone, onSuccess }: SignInModalProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState(cosomPhone || "+998");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  // 1️⃣ SEND PHONE
  const sendPhone = async () => {
    if (!phone) return alert("Введите номер");

    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_URL}/auth/I-Market/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.tmp?.code || res?.code) {
            setStep(2);
            setCode(res?.tmp?.code || res?.code);
          }
        });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ VERIFY CODE
  const verifyCode = async () => {
    if (!code) return alert("Введите код");

    try {
      setLoading(true);
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/auth/I-Market/register/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, code }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          toast("Вы успешно зарегистрированы");
          dispatch(changeToken(res?.token));
          if (onSuccess) onSuccess();
        });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-[1000] inset-1 bg-[#21212199] flex items-center justify-center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-[600px] w-full p-[20px] sm:p-[63px]"
      >
        <h3 className="text-[32px] font-bold">Регистрация & Логин</h3>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <p className="text-[14px] mt-[20px] mb-2">Введите номер телефона</p>

            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input
                value={phone}
                onChange={(e) => setPhone(formatUzPhone(e.target.value))}
                placeholder="+998 99 999 99 99"
                className="border px-[12px] py-[11px] w-full sm:max-w-[290px]"
              />
              <button
                onClick={sendPhone}
                disabled={loading}
                className="bg-black text-white px-[16px]"
              >
                {loading ? "Отправка..." : "Отправить SMS"}
              </button>
            </div>
            <div className="text-[12px] text-[#9E9E9E] mt-4 leading-[140%]">
              <p className="mb-2">
                Регистрируясь на нашем сайте, вы подтверждаете свое согласие с нашей <span className="text-[#2F80ED] cursor-pointer">Политикой конфиденциальности</span> и <span className="text-[#2F80ED] cursor-pointer">Условиями использования</span>.
              </p>
              <p>
                Эти документы содержат важную информацию о том, как мы защищаем ваши персональные данные, обрабатываем информацию и регулируем использование нашего сервиса. Мы рекомендуем вам внимательно ознакомиться с ними перед завершением регистрации, чтобы быть уверенными в прозрачности и безопасности нашего взаимодействия. Ваше доверие и защита ваших данных для нас приоритетны!
              </p>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <p className="text-[14px] mt-[20px] mb-2">
              Код отправлен на {phone}
            </p>

            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="SMS код"
                className="border px-[12px] py-[11px] w-full sm:max-w-[290px]"
              />

              <button
                onClick={verifyCode}
                disabled={loading}
                className="bg-black text-white px-[40px]"
              >
                {loading ? "Проверка..." : "Подтвердить"}
              </button>
            </div>
            <p className="text-[12px] text-[#9E9E9E] mt-4 leading-[140%]">
              Если вы не получили код, попробуйте отправить запрос повторно или свяжитесь с нашей техподдержкой. Убедитесь, что вы находитесь в правильном регионе, номер указан с верным кодом страны (+998), и сеть работает стабильно.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
