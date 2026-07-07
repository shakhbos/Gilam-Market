/**
 * Backend response tiplari — `/qr-base/i-market*` va boshqa `Real-Grm-Back`
 * endpointlariga mos. Sitening barcha data-fetching qatlami shu tiplarni
 * ishlatadi; barcha `any` bosqichma-bosqich shulariga o'tkaziladi.
 *
 * Manba: Real-Grm-Back/src/modules/qr-base/qr-base.entity.ts va
 * qr-base.service.ts (findAllIMarket, findAllIMarketGrouped, findOne).
 */

export interface Media {
  id: string;
  path: string;
  mimetype?: string;
  name?: string;
  size?: number;
}

export interface NamedEntity {
  id: string;
  title: string;
  internetTitle?: string | null;
}

export interface SizeEntity extends NamedEntity {
  x: number;
  y: number;
  kv?: number;
}

export interface CollectionPrice {
  id: string;
  priceMeter: number;
  type?: 'filial' | 'dealer' | 'market';
}

export interface Collection extends NamedEntity {
  description?: string | null;
  collection_prices?: CollectionPrice[];
}

/**
 * Guruh (Collection + Model + Shape + Color) ichidagi bitta o'lcham:
 *   - id: sizeId
 *   - x, y: fizik o'lcham (metrda: 3.0 = 300 sm)
 *   - count: shu o'lchamdagi mavjud (aktiv, band emas) mahsulotlar soni
 */
export interface GroupSize {
  id: string;
  x: number;
  y: number;
  count: number;
}

/**
 * QrBase (i-market single endpoint javobi). `sizes` maydonini backend
 * `includeGroupSizes=true` bilan qaytaradi (2026-07 dan boshlab).
 */
export interface QrBaseProduct {
  id: string;
  code: string;
  status: string;
  isMetric: boolean;
  i_price: number | string;
  internetInfo?: string | null;
  internetTitle?: string | null;
  sizeType?: string | null;

  imgUrl?: Media | null;
  videoUrl?: Media | null;
  other_images?: Media[];

  collection?: Collection | null;
  model?: NamedEntity | null;
  size?: SizeEntity | null;
  shape?: NamedEntity | null;
  color?: NamedEntity | null;
  style?: NamedEntity | null;
  country?: NamedEntity | null;
  factory?: NamedEntity | null;

  sizes?: GroupSize[];
  total_count?: number;
  total_volume?: number;
}

/**
 * List response (i-market, i-market-grouped).
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  totals?: {
    total_count: number;
    total_volume: number;
  };
}
