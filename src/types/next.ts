import type { ReactNode } from "react";

/**
 * Next.js 15 App Router pattern: `params` va `searchParams` — har doim
 * `Promise<...>` (async component `await` qiladi).
 */
export type LocaleParams = { locale: string };

export type PageProps<
  P = LocaleParams,
  S = Record<string, string | string[] | undefined>,
> = {
  params: Promise<P>;
  searchParams: Promise<S>;
};

/**
 * `generateMetadata({ params })` uchun — searchParams shart emas.
 */
export type MetadataProps<P = LocaleParams> = {
  params: Promise<P>;
};

export type LayoutProps<P = LocaleParams> = {
  children: ReactNode;
  params: Promise<P>;
};
