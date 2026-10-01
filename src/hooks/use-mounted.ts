"use client";

import { useEffect, useState } from "react";

/**
 * `false` server'da VA client'ning birinchi render'ida, `true` faqat shu
 * komponentning O'Z mount-effect'i ishga tushgandan keyin.
 *
 * Nega kerak: localStorage'dan kelgan holat (savat, likes va h.k.) SSR'da
 * mavjud emas — agar bir komponent shu holatni effect orqali ERTA
 * (boshqa komponentlar hali hydrate bo'lib ulgurmay) global store'ga
 * yozsa, katta daraxtda React'ning bo'lib-bo'lib (concurrent) hydration'i
 * tufayli HALI HYDRATE BO'LMAGAN boshqa komponent server HTML'i bilan
 * mos kelmay qolishi mumkin (hydration mismatch) — chunki u darhol YANGI
 * qiymat bilan render qilinadi. `useMounted()` BUTUNLAY boshqa
 * komponent/effect tezligidan mustaqil: faqat shu komponentning o'z
 * birinchi commit'idan keyin `true` bo'ladi, shuning uchun undan oldingi
 * render SSR bilan har doim bir xil bo'lishi kafolatlanadi.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
