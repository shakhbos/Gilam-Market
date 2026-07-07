import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ru", "uz"],

  defaultLocale: "ru",
});

const navigation = createNavigation(routing);

export const { Link, redirect, usePathname, getPathname } = navigation;

import NProgress from "nprogress";

export const useRouter = () => {
  const router = navigation.useRouter();

  return {
    ...router,
    push: (...args: Parameters<typeof router.push>) => {
      NProgress.start();
      return router.push(...args);
    },
    replace: (...args: Parameters<typeof router.replace>) => {
      NProgress.start();
      return router.replace(...args);
    },
  };
};
