"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
    interface Window {
        ym: any;
    }
}

export default function Metrika() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

        if (typeof window !== "undefined" && window?.ym) {
            window?.ym('106466422', "hit", url);
        }
    }, [pathname, searchParams]);

    return (
        <Script id="yandex-metrika">
            {`
 (function(m,e,t,r,i,k,a){
        m[i]=m[i]function(){(m[i].a=m[i].a[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106466422', 'ym');

    ym(106466422, 'init', { defer: true, ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
      `}
        </Script>
    );
}