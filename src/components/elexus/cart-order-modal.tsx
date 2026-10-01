"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearElexusCart } from "@/lib/features/cart-elexus/cart-elexus-slice";
import { formatSumElexus } from "@/utils/format-sum-elexus";
import { formatUzPhone } from "@/lib/formatUzPhone";

const PAYMENT_OPTIONS = [
  { key: "cash", label: "Наличными при получении" },
  { key: "card", label: "Картой при получении" },
] as const;
type PaymentKey = (typeof PAYMENT_OPTIONS)[number]["key"];

/*
 * Elexus — savat sahifasidagi "Заявка" (buyurtmani tasdiqlash) modali.
 * Figma 100:1021 ("// ЗАЯВКА" overlay) asosida qurilgan. Backend order
 * API'si HALI YO'Q (qarang Gilam-Market/MEMORY.md "Keyingi navbatdagi
 * nomzodlar") — submit qilinganda shu yerda hali fetch chaqiruvi yo'q,
 * faqat savat tozalanadi va modal ichida qisqa tasdiqlash holatiga
 * almashadi. Backend API kelganda `handleSubmit` ichiga ulanadi.
 */
export default function CartOrderModal({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cartElexus.items);
  const total = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentKey>("cash");
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const canSubmit =
    name.trim() !== "" && phone.replace(/\D/g, "").length === 12 && address.trim() !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    dispatch(clearElexusCart());
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#00000080] p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto max-h-[90vh] w-full max-w-[1241px] overflow-y-auto bg-[#814331] p-[32px] sm:p-[64px]"
        style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
      >
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute right-[24px] top-[24px] text-[#e0caab] transition-opacity duration-150 hover:opacity-70 sm:right-[32px] sm:top-[32px]"
        >
          <X size={24} strokeWidth={1.25} />
        </button>

        {sent ? (
          <div className="flex flex-col items-start py-[40px] sm:py-[60px]">
            <h2 className="text-[32px] font-medium uppercase leading-[1.5] tracking-[-0.55px] text-[#e0caab] sm:text-[50px]">
              {"//  Заявка отправлена"}
            </h2>
            <p className="mt-[16px] max-w-[500px] text-[16px] leading-[1.5] text-white">
              Спасибо! Мы свяжемся с вами в ближайшее время для подтверждения заказа.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-[40px] flex h-[64px] items-center bg-black px-[32px] text-[16px] font-semibold uppercase text-white transition-opacity duration-150 hover:opacity-90"
            >
              Хорошо
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-[32px] font-medium uppercase leading-[1.5] tracking-[-0.55px] text-[#e0caab] sm:text-[50px]">
              {"//  Заявка"}
            </h2>

            <div className="mt-[32px] grid grid-cols-1 gap-x-[32px] gap-y-[24px] sm:mt-[40px] sm:grid-cols-2">
              <label className="block">
                <span className="text-[16px] uppercase tracking-[-0.176px] text-[#e0caab]">Имя</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Имя и фамилия"
                  className="mt-[10px] h-[64px] w-full bg-[#e0caab] px-[22px] text-[16px] uppercase tracking-[-0.176px] text-black outline-none placeholder:text-black/50"
                />
              </label>
              <label className="block">
                <span className="text-[16px] uppercase tracking-[-0.176px] text-[#e0caab]">Телефон</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(formatUzPhone(e.target.value))}
                  className="mt-[10px] h-[64px] w-full bg-[#e0caab] px-[22px] text-[16px] uppercase tracking-[-0.176px] text-black outline-none placeholder:text-black/50"
                />
              </label>
            </div>

            <label className="mt-[24px] block sm:mt-[32px]">
              <span className="text-[16px] uppercase tracking-[-0.176px] text-[#e0caab]">Адрес доставки</span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Введите адрес доставки"
                className="mt-[10px] h-[64px] w-full bg-[#e0caab] px-[22px] text-[16px] uppercase tracking-[-0.176px] text-black outline-none placeholder:text-black/50"
              />
            </label>

            <div className="mt-[24px] sm:mt-[32px]">
              <span className="text-[16px] uppercase tracking-[-0.176px] text-[#e0caab]">Оплата</span>
              <div className="mt-[10px] flex flex-col gap-[2px] bg-[#e0caab]/20 text-[16px] uppercase tracking-[-0.176px] sm:flex-row sm:flex-wrap">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={payment === opt.key}
                    onClick={() => setPayment(opt.key)}
                    className={
                      payment === opt.key
                        ? "flex h-[56px] w-full items-center bg-[#e0caab] px-[24px] text-black sm:w-auto"
                        : "flex h-[56px] w-full items-center px-[24px] text-[#e0caab] transition-colors duration-150 hover:text-white sm:w-auto"
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-[24px] block sm:mt-[32px]">
              <span className="text-[16px] uppercase tracking-[-0.176px] text-[#e0caab]">Комментарий</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Оставьте комментарий для курьера"
                rows={3}
                className="mt-[10px] w-full resize-none bg-[#e0caab]/20 p-[22px] text-[16px] uppercase tracking-[-0.176px] text-black outline-none placeholder:text-[#e0caab]"
              />
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              aria-disabled={!canSubmit}
              className={`mt-[32px] flex h-[90px] w-full items-center justify-between px-[33px] text-white transition-opacity duration-150 sm:mt-[40px] ${
                canSubmit ? "bg-black hover:opacity-90" : "cursor-not-allowed bg-black/40"
              }`}
            >
              <span className="text-[16px] font-semibold uppercase">Отправить заявку</span>
              <span className="text-[16px] font-semibold">{formatSumElexus(total)} сум</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
