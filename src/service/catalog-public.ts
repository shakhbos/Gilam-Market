import { fetchData } from "./get";

/*
 * Real-Grm-Back'ning `ShopProductPublicController`siga mos — 3-bosqich
 * (OPERATOR-ROADMAP.md), 2026-10-06. Tenant `?shop=<slug>` query param
 * orqali aniqlanadi (`TenantMiddleware`ning Host header ishlamagandagi
 * zaxira yo'li — SSR fetch Host'i doim `api.gilam-market.uz`, shuning
 * uchun bu yo'l HAR DOIM ishlatiladi, `X-Shop-Host` kerak emas).
 */

const API_BASE = process.env.NEXT_PUBLIC_URL || "https://api.gilam-market.uz/api";

export type ApiCatalogColor = { id: string; title: string };
export type ApiCatalogSize = { id: string; x: number | string; y: number | string };

export type ApiCatalogGroup = {
  collectionTitle: string;
  collectionId: string;
  modelId: string;
  modelTitle: string;
  shapeId: string;
  shapeTitle: string | null;
  colors: ApiCatalogColor[] | null;
  sizes: ApiCatalogSize[] | null;
  imgPath: string | null;
  price: string | null;
  description: string | null;
  density: string | null;
  pileHeight: string | null;
  material: string[] | null;
  interiorStyle: string[] | null;
  care: string | null;
  totalCount: number;
  variantCount: number;
};

export type ApiGroupDetailColor = {
  id: string;
  title: string;
  colorFamilyId: string | null;
  imgPath: string | null;
};

export type ApiGroupMedia = {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  sortOrder: number;
};

export type ApiGroupDetail = {
  colors: ApiGroupDetailColor[];
  sizes: ApiCatalogSize[];
  price: string | null;
  media: ApiGroupMedia[];
  collection: {
    internetTitle: string | null;
    description: string | null;
    material: string[] | null;
    density: string | null;
    pileHeight: string | null;
    interiorStyle: string[] | null;
    care: string | null;
    originCountry: string | null;
    originFactory: string | null;
  } | null;
};

/** Katalog ro'yxati — nashr etilgan BARCHA guruhlar (bitta so'rovda, sahifalashsiz —
 * sahifa ichidagi accordion/kolleksiya sahifasi uchun to'liq ro'yxat kerak). */
export async function fetchCatalogGroups(shopSlug: string, search?: string): Promise<ApiCatalogGroup[]> {
  const res = await fetchData<{ items: ApiCatalogGroup[] }>(`${API_BASE}/shop-product/public/catalog`, {
    shop: shopSlug,
    search,
    limit: 500,
  });
  return res?.items ?? [];
}

export async function fetchGroupDetail(
  shopSlug: string,
  collectionId: string,
  modelId: string,
  shapeId: string,
): Promise<ApiGroupDetail | null> {
  return fetchData<ApiGroupDetail>(`${API_BASE}/shop-product/public/catalog/group-detail`, {
    shop: shopSlug,
    collectionId,
    modelId,
    shapeId,
  });
}
