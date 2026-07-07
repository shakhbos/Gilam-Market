"use client";
import { useRouter, usePathname } from "../i18n/routing";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Container from "./container";
import { changeUserMe } from "../lib/features";
import { fetchData } from "../service/get";
import {
  BurgerIcons,
  BusketIcons,
  HomeIcons,
  LikeIcons,
  PersonIcons,
  SearchIcons,
  TelIcons,
  FilterIcons,
  LoginIcons,
} from "./icons";
import SignInMadal from "./sign-in";
import { useAppDispatch, useAppSelector } from "../lib/hooks";

import Menu from "./menu";
import { Drawer } from "antd";
import FilterModal from "./filter-modal";
import { useTranslations } from "next-intl";


export default function FixedLayout() {
  const t = useTranslations('Layout');
  const [isFocus, setIsfocus] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { likes } = useAppSelector((store) => store.likes);
  const { buskets } = useAppSelector((store) => store.buskets);
  const { token } = useAppSelector((store) => store.token);
  const { userMe } = useAppSelector((store) => store.userMe);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = (e) => {
    const term = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setIsMounted(true);
    window.addEventListener("click", () => {
      setOpenAuth(false);
      // setOpenFilter(false); // Optional: close filter on outside click if desired, but modal handles its own background click usually
    });
  }, []);
  useEffect(() => {
    if (!token) return;

    const getMe = async () => {
      try {
        const response = await fetchData(
          `${process.env.NEXT_PUBLIC_URL}/auth/get/I-Market/me`,
          {
            token,
          }
        );

        dispatch(changeUserMe(response))
      } catch (error) {
        console.error(error);
      }
    };

    getMe();
  }, [token]);

  return (
    <>
      <Container
        className={
          "flex justify-center sm:justify-between inset-x-0 fixed bottom-[20px] sm:bottom-[40px] px-4 sm:px-0 w-full z-50 pointer-events-none"
        }
      >
        <div className="lg:w-[162px] hidden lg:block"></div>
        <div className="flex gap-1 pointer-events-auto  rounded-[8px]">
          <div
            onClick={() => router.push("/")}
            className={`cursor-pointer ${pathname === "/" ? "bg-[#121212] text-white" : "bg-white"}  h-[40px] p-[10px] rounded-[8px] shadow`}
            role="button"
            aria-label="Home"
          >
            <HomeIcons stroke={pathname === "/" ? "white" : "black"} />
          </div>

          <div
            onClick={showDrawer}
            className="cursor-pointer  h-[40px] flex gap-1  items-center bg-white p-[10px] rounded-[8px] shadow"
            role="button"
            aria-label="Menu"
          >
            <BurgerIcons />
            <p className="text-[14px] leading-[18px]">{t('menu')}</p>
          </div>

          <div className="cursor-pointer  h-[40px] bg-white p-[10px] rounded-[8px] shadow flex gap-1  items-center ">
            <SearchIcons />
            <input
              onFocus={() => setIsfocus(true)}
              onBlur={() => setIsfocus(false)}
              onChange={handleSearch}
              defaultValue={searchParams.get("search")?.toString()}
              className={`max-w-[120px] transition-all duration-150 ease-in-out  w-full outline-none`}
              placeholder={t('search')}
              aria-label="Search"
            />
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilter(true);
            }}
            className="cursor-pointer h-[40px]  flex gap-1 items-center bg-white p-[10px] rounded-[8px] shadow"
            role="button"
            aria-label="Filter"
          >
            <FilterIcons />
            <p className="text-[14px] leading-[18px]">{t('filter')}</p>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              if (userMe?.id) {
                router.push("/profile/account");
              } else {
                setOpenAuth(true);
              }
            }}
            className={`cursor-pointer h-[40px]  flex gap-1 items-center ${pathname === "/profile/account" ? "bg-[#121212] text-white" : "bg-white"} p-[10px] rounded-[8px] shadow`}
            role="button"
            aria-label="Profile"
          >
            {userMe?.id ? <PersonIcons stroke={pathname === "/profile/account" ? "white" : "black"} /> : <LoginIcons stroke={pathname === "/profile/account" ? "white" : "black"} />}
            <p className="text-[14px] leading-[18px]">{userMe?.id ? t('profile') : t('login')}</p>
          </div>

          <div
            onClick={() => router.push("/profile/likes")}
            className={`cursor-pointer relative h-[40px] w-[40px] ${pathname === "/profile/likes" ? "bg-[#121212] text-white" : "bg-white"} p-[10px] rounded-[8px] shadow`}
            role="button"
            aria-label="Likes"
          >
            {isMounted && likes?.length ? (
              <p className="h-[12px] w-[12px] text-[10px] leading-[12px] flex items-center absolute  justify-center text-white bg-[#FFA500] rounded-[1px] top-[2px] right-[2px]">
                {likes?.length}
              </p>
            ) : (
              ""
            )}
            <LikeIcons stroke={pathname === "/profile/likes" ? "white" : "black"} />
          </div>
          <div
            onClick={() => router.push("/profile/busket")}
            className={`cursor-pointer h-[40px] w-[40px] relative ${pathname === "/profile/busket" ? "bg-[#121212] text-white" : "bg-white"} p-[10px] rounded-[8px] shadow`}
            role="button"
            aria-label="Basket"
          >
            {isMounted && buskets?.length ? (
              <p className="h-[12px] w-[12px] text-[10px] leading-[12px] flex items-center absolute  justify-center text-white bg-[#FFA500] rounded-[1px] top-[2px] right-[2px]">
                {buskets?.length}
              </p>
            ) : (
              ""
            )}
            <BusketIcons stroke={pathname === "/profile/busket" ? "white" : "black"} />
          </div>
        </div>
        <a
          href="tel:+998991404422"
          className="cursor-pointer hidden  bg-white p-[10px] rounded-[8px] shadow lg:flex gap-1  items-center "
          aria-label="Call Us"
        >
          <TelIcons />
          <p className="text-[14px] leading-[18px]">+998 94 609-34-44</p>
        </a>


      </Container>
      {openAuth ? <SignInMadal onSuccess={() => setOpenAuth(false)} /> : ""}
      {openFilter ? <FilterModal onClose={() => setOpenFilter(false)} /> : ""}

      <Drawer
        // title="Menu"

        placement={"bottom"}
        closable={true}
        onClose={onClose}
        open={open}
      >
        <Menu />
      </Drawer>
    </>
  );
}
