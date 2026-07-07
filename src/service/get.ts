import qs from "qs";

/**
 * Server-side data fetch helper.
 *
 * - Turli endpointlar bir xil interface bilan chaqiriladi va typed T qaytaradi.
 * - Xatolikni sukut o'chirmaymiz: server logga yozib `null` qaytaramiz —
 *   chaqiruvchi Server Component `null` bo'lsa `notFound()` chizishi kerak.
 * - Default `cache: 'no-store'` — mahsulot narx/qoldiq real vaqtda o'zgaruvchan,
 *   ISR eski holatni ko'rsatmasin. Chaqiruvchi kerak bo'lsa `next: { revalidate }`
 *   uzatishi mumkin (masalan sitemap uzoq muddatga keshlanadi).
 */
export async function fetchData<T = unknown>(
  url: string,
  query?: Record<string, unknown>,
  init?: RequestInit,
): Promise<T | null> {
  const params = query
    ? `?${qs.stringify(query, { arrayFormat: "repeat", skipNulls: true })}`
    : "";

  try {
    const res = await fetch(`${url}${params}`, {
      method: "GET",
      cache: "no-store",
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.headers || {}),
      },
    });

    if (!res.ok) {
      console.error(
        `[fetchData] ${res.status} ${res.statusText} for ${url}${params}`,
      );
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(
      `[fetchData] network error for ${url}${params}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
