"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
    __metrikaId?: number;
  }
}

/** Saytdagi maqsad (goal) — Metrica'da shu identifikator bilan "JavaScript event" maqsadi yaratiladi. */
export const METRIKA_GOALS = {
  /** "Заявка" muvaffaqiyatli yuborildi */
  orderSent: "zayavka",
} as const;

export function reachGoal(goal: string) {
  try {
    if (window.ym && window.__metrikaId) window.ym(window.__metrikaId, "reachGoal", goal);
  } catch {
    // analitika hech qachon sayt ishini buzmasin
  }
}

/**
 * Yandex Metrica — hisoblagich har do'kon (tenant) uchun o'zi:
 * `Shop.metaSettings.analytics.yandexMetrikaId` (backend `/shop/public`).
 * ID yo'q bo'lsa hech narsa yuklanmaydi. SPA'da sahifa almashganda `hit` yuboriladi.
 */
export default function Metrika({ counterId }: { counterId: string | null | undefined }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = counterId && /^\d{5,12}$/.test(counterId) ? Number(counterId) : null;
  const firstHit = useRef(true);

  useEffect(() => {
    if (!id) return;
    // Birinchi hit'ni `init` o'zi yuboradi — ikki marta sanalmasin.
    if (firstHit.current) {
      firstHit.current = false;
      return;
    }
    const query = searchParams.toString();
    window.ym?.(id, "hit", `${pathname}${query ? `?${query}` : ""}`, { referer: document.referrer });
  }, [id, pathname, searchParams]);

  if (!id) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${id}', 'ym');
window.__metrikaId = ${id};
ym(${id}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
      `}
    </Script>
  );
}
