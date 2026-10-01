import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/*
 * Elexus — savat (korzina) Redux state. `buskets` (src/lib/features/busket)
 * dan ATAYLAB alohida: u eski "glam" bozor sahifalariga tegishli, boshqa
 * data shape'ga ega. Bu yerda har qator faqat identifikator+tanlov+narx
 * snapshot'ini saqlaydi — sarlavha/rasm/spec kabi ko'rsatiladigan matnlar
 * render vaqtida `catalog-elexus.ts`dan (`collectionSlug`+`productId`
 * orqali) qayta olinadi, localStorage'da takrorlanmaydi.
 *
 * `pricePerUnit`/`maxQuantity` — qo'shilgan paytdagi SNAPSHOT (keyinchalik
 * katalog narxi o'zgarsa ham, savatdagi qator eski narxda qoladi — odatiy
 * e-commerce xatti-harakati).
 *
 * `initialState.items` ATAYLAB har doim BO'SH — hatto client'da ham
 * localStorage'ni SINXRON o'qimaydi. Agar o'qisa edi: server HTML'i
 * (localStorage'ga kirisholmaydi) har doim bo'sh savat bilan render
 * bo'ladi, lekin client'ning BIRINCHI render'i (hydration) localStorage'da
 * allaqachon narsa bo'lsa — DARHOL to'la savat bilan chiqadi → React
 * hydration mismatch xatosi (DOM strukturasi mos kelmaydi — masalan
 * header'dagi savat badge'i server'da yo'q, client'da bor). Shuning uchun
 * haqiqiy localStorage holati `hydrateElexusCart` orqali faqat `useEffect`
 * ICHIDA (mount'dan keyin, StoreProvider'da) o'qiladi — shu payt server va
 * client'ning BIRINCHI render'i allaqachon bir xil (bo'sh), keyingi
 * yangilanish oddiy state update (mismatch emas).
 */

export type ElexusCartItem = {
  /** `${collectionSlug}:${productId}:${size}` — bir xil model+o'lcham bitta qatorga yig'iladi. */
  id: string;
  collectionSlug: string;
  productId: string;
  size: string;
  pricePerUnit: number;
  maxQuantity: number;
  quantity: number;
  /** ISO sana — shu qator birinchi marta savatga qo'shilgan payt. */
  addedAt: string;
};

type ElexusCartState = {
  items: ElexusCartItem[];
  /**
   * `addElexusCartItem` har chaqirilganda +1 — localStorage'da SAQLANMAYDI,
   * faqat shu sessiya davomida "hozirgina haqiqiy qo'shish bo'ldi" signalini
   * beradi. Header shu qiymatning O'ZGARISHINI kuzatib, savat ikonkasiga
   * animatsiya qo'shadi (toast o'rniga — 2026-10-01 user so'rovi). `items`
   * sonidan EMAS, aynan shu hisoblagichdan foydalanish MUHIM: `items.length`
   * yoki umumiy miqdor mount paytida localStorage'dan hydrate bo'lganda HAM
   * o'zgaradi (qayta ochilgan sahifada eski savat tiklanganda) — bu holatda
   * animatsiya NOTO'G'RI bo'lib chiqardi (foydalanuvchi hech narsa
   * bosmagan). `addCounter` esa faqat HAQIQIY `addElexusCartItem` dispatch
   * qilinganda o'zgaradi, hydration'da EMAS — shuning uchun boshlang'ich
   * qiymati (0) server/client/hydration'da HAR DOIM bir xil.
   */
  addCounter: number;
};

const STORAGE_KEY = "elexus-cart";

/** Faqat mount'dan keyingi `useEffect`da chaqirilishi kerak (StoreProvider). */
export function readElexusCartFromStorage(): ElexusCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items: ElexusCartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const initialState: ElexusCartState = {
  items: [],
  addCounter: 0,
};

export type AddElexusCartItemPayload = {
  collectionSlug: string;
  productId: string;
  size: string;
  pricePerUnit: number;
  maxQuantity: number;
  quantity: number;
};

const elexusCartSlice = createSlice({
  name: "elexusCart",
  initialState,
  reducers: {
    addElexusCartItem: (state, action: PayloadAction<AddElexusCartItemPayload>) => {
      const { quantity, ...rest } = action.payload;
      const id = `${rest.collectionSlug}:${rest.productId}:${rest.size}`;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity = Math.min(existing.maxQuantity, existing.quantity + quantity);
      } else {
        state.items.push({ id, ...rest, quantity, addedAt: new Date().toISOString() });
      }
      state.addCounter += 1;
      persist(state.items);
    },
    setElexusCartQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, Math.min(item.maxQuantity, action.payload.quantity));
        persist(state.items);
      }
    },
    removeElexusCartItem: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
      persist(state.items);
    },
    clearElexusCart: (state) => {
      state.items = [];
      persist(state.items);
    },
    /** StoreProvider mount'da bir marta chaqiradi — qarang yuqoridagi izoh. */
    hydrateElexusCart: (state, action: PayloadAction<ElexusCartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addElexusCartItem,
  setElexusCartQuantity,
  removeElexusCartItem,
  clearElexusCart,
  hydrateElexusCart,
} = elexusCartSlice.actions;
export default elexusCartSlice.reducer;
