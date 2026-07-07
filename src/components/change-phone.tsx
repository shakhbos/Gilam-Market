"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

import { formatUzPhone } from "../lib/formatUzPhone";
import { useAppSelector } from "../lib/hooks";

interface Props {
  onSuccess?: () => void;
}

export default function ChnagePhone({ onSuccess }: Props) {
  const t = useTranslations("ChangePhone");
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("+998");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAppSelector((store) => store.token);

  const sendPhone = async () => {
    if (!phone) return alert(t("phoneMissing"));
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_URL}/user/client/change-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
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
      // network error — swallowed intentionally
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) return alert(t("codeMissing"));
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_URL}/user/client/confirm-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ code }),
      }).then(() => {
        toast(t("success"));
        if (onSuccess) onSuccess();
      });
    } catch (e) {
      // network error — swallowed intentionally
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#21212199] flex items-center justify-center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-[600px] w-full md:p-[20px] p-[14px] sm:p-[63px]"
      >
        <h3 className="text-[16px] md:text-[32px] font-bold">{t("title")}</h3>

        {step === 1 && (
          <>
            <p className="md:text-[14px] text-[12px] md:mt-[20px] mt-[14px] mb-2">
              {t("phonePrompt")}
            </p>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input
                value={phone}
                onChange={(e) => setPhone(formatUzPhone(e.target.value))}
                placeholder="+998 99 999 99 99"
                className="border md:px-[12px] px-[8px] md:py-[11px] py-[8px] w-full sm:max-w-[290px]"
              />
              <button
                onClick={sendPhone}
                disabled={loading}
                className="bg-black w-full md:w-auto text-white py-[11px] px-[16px]"
              >
                {loading ? t("sending") : t("sendCode")}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="md:text-[14px] text-[12px] md:mt-[20px] mt-[14px] mb-2">
              {t("codeSentTo")} · {phone}
            </p>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("codePlaceholder")}
                className="border md:px-[12px] px-[8px] md:py-[11px] py-[8px] w-full sm:max-w-[290px]"
              />
              <button
                onClick={verifyCode}
                disabled={loading}
                className="bg-black w-full md:w-auto text-white py-[11px] px-[16px]"
              >
                {loading ? t("verifying") : t("confirm")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
