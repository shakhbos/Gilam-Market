"use client";
import Back from "../components/back";
import Container from "../components/container";
import React from "react";
import { Link, usePathname, useRouter } from "../i18n/routing";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Popconfirm } from "antd";
import { changeToken, changeUserMe } from "@/lib/features";

const arr = [
  { name: "Избранные", link: "likes", isAuth: false },
  { name: "Мои покупки", link: "my-order", isAuth: true },
  { name: "Корзина", link: "busket", isAuth: false },
  { name: "Аккаунт", link: "account", isAuth: true },
];

export default function ProfileLayout({ children }) {
  const pathName = usePathname();
  const router = useRouter();
  const { userMe } = useAppSelector((store) => store.userMe);
  const dispatch = useAppDispatch();
  const confirm = () => {
    dispatch(changeUserMe(null))
    dispatch(changeToken(null))
    router.push("/");
  };

  return (
    <Container
      className={
        "flex flex-wrap md:flex-nowrap   md:mt-[26px]  mt-[14px] gap-[35px] items-center"
      }
    >
      <Back />
      <div className="mt-[14px] w-full">
        <h3 className="mb-[71px] md:inline-block hidden text-[22px] leading-[25px]">
          Избранные
        </h3>
        <div className="flex mb-[100px]  flex-wrap md:flex-nowrap gap-[20px] lg:gap-[80px] w-full">
          <div className="w-full flex gap-5 md:inline-block md:max-w-[115px] overflow-x-auto scrollbar-hide">
            {arr?.map((e, i) => {
              if (userMe || !e.isAuth) {
                return (
                  <Link
                    key={i}
                    href={`/profile/${e?.link}`}
                    className={`${pathName.includes(e?.link) ? "opacity-100" : "opacity-45"
                      } inline-block md:w-full mb-[12px] text-[13px] sm:text-[15px] leading-[21px] whitespace-nowrap`}
                  >
                    {e?.name}
                  </Link>
                );
              }
            })}

            {userMe && <Popconfirm
              title="Log out"
              description="Are you sure to log out?"
              onConfirm={confirm}
              okText="Yes"
              cancelText="No"
            >
              <p className="inline-block md:w-full mb-[12px] text-[13px] sm:text-[15px] leading-[21px] cursor-pointer md:mt-[25px] whitespace-nowrap">
                Выйти
              </p>
            </Popconfirm>}
          </div>
          {children}
        </div>
      </div>
    </Container>
  );
}
