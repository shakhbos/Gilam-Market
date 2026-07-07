"use client";
import type { ReactNode } from "react";
import { Popconfirm } from "antd";
import { useTranslations } from "next-intl";

import Back from "../components/back";
import Container from "../components/container";
import { Link, usePathname, useRouter } from "../i18n/routing";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { changeToken, changeUserMe } from "@/lib/features";

const NAV_ITEMS = [
  { key: "likes", link: "likes", isAuth: false },
  { key: "myOrders", link: "my-order", isAuth: true },
  { key: "basket", link: "busket", isAuth: false },
  { key: "account", link: "account", isAuth: true },
] as const;

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("Profile");
  const pathName = usePathname();
  const router = useRouter();
  const { userMe } = useAppSelector((store) => store.userMe);
  const dispatch = useAppDispatch();

  const confirmLogout = () => {
    dispatch(changeUserMe(null));
    dispatch(changeToken(null));
    router.push("/");
  };

  return (
    <Container
      className={
        "flex flex-wrap md:flex-nowrap md:mt-[26px] mt-[14px] gap-[35px] items-center"
      }
    >
      <Back />
      <div className="mt-[14px] w-full">
        <h3 className="mb-[71px] md:inline-block hidden text-[22px] leading-[25px]">
          {t("likesTitle")}
        </h3>
        <div className="flex mb-[100px] flex-wrap md:flex-nowrap gap-[20px] lg:gap-[80px] w-full">
          <div className="w-full flex gap-5 md:inline-block md:max-w-[115px] overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => {
              if (!userMe && item.isAuth) return null;
              const active = pathName.includes(item.link);
              return (
                <Link
                  key={item.link}
                  href={`/profile/${item.link}`}
                  className={`${
                    active ? "opacity-100" : "opacity-45"
                  } inline-block md:w-full mb-[12px] text-[13px] sm:text-[15px] leading-[21px] whitespace-nowrap`}
                >
                  {t(item.key)}
                </Link>
              );
            })}

            {userMe && (
              <Popconfirm
                title={t("logout")}
                description={t("logoutConfirm")}
                onConfirm={confirmLogout}
                okText="✓"
                cancelText="✕"
              >
                <p className="inline-block md:w-full mb-[12px] text-[13px] sm:text-[15px] leading-[21px] cursor-pointer md:mt-[25px] whitespace-nowrap">
                  {t("logout")}
                </p>
              </Popconfirm>
            )}
          </div>
          {children}
        </div>
      </div>
    </Container>
  );
}
