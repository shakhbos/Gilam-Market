import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

/*
 * Avval faqat "/" va "/(ru|en|uz)/:path*" ushlanardi — shuning uchun
 * locale-prefiks'siz ichki havolalar ("/catalog", "/account" va h.k.,
 * ko'plab Elexus komponentlarida oddiy <a href> bilan yozilgan) middleware'ga
 * umuman tushmasdi va to'g'ridan-to'g'ri 404'ga borardi (faqat "/[locale]/
 * catalog" mavjud, "/catalog" emas). next-intl'ning tavsiya etilgan keng
 * matcher'i: static fayl/`_next`/`api`dan boshqa HAMMA yo'lni ushlaydi va
 * kerakli locale'ga qayta yo'naltiradi.
 */
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
