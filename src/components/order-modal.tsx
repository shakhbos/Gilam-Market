'use client'
import { useRouter } from "@/i18n/routing";

export default function OrderModal() {
  const router = useRouter();
  return (
    <>
      <div className="fixed inset-0 bg-[#21212199] flex items-center justify-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white max-w-[600px] w-full p-[20px] sm:p-[63px]"
        >
          <h4 className="text-[14px]  text-center ">
            Спасибо, что выбрали нас!
          </h4>
          <h4 className="text-[32px]  text-center font-bold">
            Ваш заказ отправлен!
          </h4>
          <p className="mt-[15px] mx-auto text-center text-[#21212173]  w-full max-w-[458px] text-[12px] mb-[33px] leading-[14px]">
            Ваш заказ успешно отправлен, и в ближайшее время модератор получит его для обработки. Если у вас возникли вопросы, вы можете связаться с модератором для уточнения информации. Мы сделаем все возможное, чтобы ваш заказ был доставлен как можно быстрее. Максимальный срок доставки – 7 дней.
          </p>

          <button onClick={() => {
            router.push(`/profile/my-order`)
          }}
            className="py-[11px] w-full bg-[#212121] text-white text-center inline-block  px-[12px] border-[#EEEEEE] border-[1px] border-solid"
          >
            Ок все понятно

          </button>

        </div>
      </div>
    </>
  );
}
