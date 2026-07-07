import qs from "qs";
export async function fetchData(url: string, query?: Record<string, any>) {
  try {
    const params = query
      ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
      : "";
    const res = await fetch(`${url}${params}`, {
      method: "GET",
      cache: "no-cache",
    });


    if (!res.ok) throw new Error(`Failed to fetch data from ${url}`);
    return res.json();
  } catch (error) {
    return null;
  }
}
