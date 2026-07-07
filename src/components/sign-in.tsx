"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

import { changeToken } from "../lib/features";
import { formatUzPhone } from "../lib/formatUzPhone";
import { useAppDispatch } from "../lib/hooks";

interface SignInModalProps {
  cosomPhone?: string;
  onSuccess?: () => void;
}

export default function SignInModal({ cosomPhone, onSuccess }: SignInModalProps) {
  const t = useTranslations("Auth");
  const consent = useTranslations("Account");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState(cosomPhone || "+998");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const sendPhone = async () => {
    if (!phone) return alert(t("phoneMissing"));
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
      // network error swallowed intentionally — user sees no toast, retry manually
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) return alert(t("codeMissing"));
    try {
      setLoading(true);
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/auth/I-Market/register/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, code }),
        },
      )
        .then((res) => res.json())
        .then((res) => {
          toast(t("registered"));
          dispatch(changeToken(res?.token));
          if (onSuccess) onSuccess();
        });
    } catch (e) {
      // network error swallowed intentionally
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
        <h3 className="text-[32px] font-bold">{t("signInTitle")}</h3>

        {step === 1 && (
          <>
            <p className="text-[14px] mt-[20px] mb-2">{t("phonePlaceholder")}</p>
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
                {loading ? t("sending") : t("sendCode")}
              </button>
            </div>
            <div className="text-[12px] text-[#9E9E9E] mt-4 leading-[140%]">
              <p className="mb-2">
                {consent("consentIntro")}{" "}
                <span className="text-[#2F80ED] cursor-pointer">
                  {consent("privacyPolicy")}
                </span>{" "}
                {consent("consentAnd")}{" "}
                <span className="text-[#2F80ED] cursor-pointer">
                  {consent("termsOfUse")}
                </span>
                {consent("consentSuffix")}
              </p>
              <p>{consent("consentBody")}</p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[14px] mt-[20px] mb-2">
              {t("codeSent")} · {phone}
            </p>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("codePlaceholder")}
                className="border px-[12px] py-[11px] w-full sm:max-w-[290px]"
              />
              <button
                onClick={verifyCode}
                disabled={loading}
                className="bg-black text-white px-[40px]"
              >
                {loading ? t("sending") : t("verify")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
