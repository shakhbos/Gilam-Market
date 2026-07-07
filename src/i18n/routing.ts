import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * next-intl routing config. Barcha useLocale / Link / usePathname / useRouter
 * shu joydan chiqadi — route hookslarni `next/navigation`'dan to'g'ridan-to'g'ri
 * chaqirmang, aks holda locale segmenti yo'qoladi.
 *
 * Progress bar (nextjs-toploader) `[locale]/layout.tsx`da o'rnatilgan —
 * route almashishida avtomatik ishlaydi, shuning uchun bu joyda NProgress
 * qo'lda chaqirilmaydi.
 */
export const routing = defineRouting({
  locales: ["en", "ru", "uz"],
  defaultLocale: "ru",
});

const navigation = createNavigation(routing);

export const { Link, redirect, usePathname, getPathname, useRouter } =
  navigation;
