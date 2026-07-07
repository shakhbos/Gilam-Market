import { redirect } from "next/navigation";

/**
 * `/glam/` — bo'sh index sahifasi. Katalog kolleksiya filter'lari home'da
 * yashaydi (search bar + tag'lar). Bosh sahifaga qaytaramiz, foydalanuvchi
 * eskirgan yoki ulanmagan chuqur link'ni qo'ymasin.
 */
export default async function GlamIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
