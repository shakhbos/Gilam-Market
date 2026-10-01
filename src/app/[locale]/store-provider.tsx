'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '../../lib/store';
import { hydrateElexusCart, readElexusCartFromStorage } from '../../lib/features';

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Elexus savat holati `localStorage`dan MOUNT'DAN KEYIN o'qiladi (slice
  // initialState'i ataylab bo'sh) — aks holda server/client birinchi
  // render'i mos kelmay, React hydration mismatch xatosi berardi.
  useEffect(() => {
    const items = readElexusCartFromStorage();
    if (items.length > 0) {
      storeRef.current?.dispatch(hydrateElexusCart(items));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
