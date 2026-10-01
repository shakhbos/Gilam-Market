import Container from "./container";
import CatalogCollectionGrid from "./catalog-collection-grid";
import CatalogCollectionSidebar from "./catalog-collection-sidebar";
import type { CatalogCollection, CatalogProductVariant } from "@/data/catalog-elexus";

/*
 * Elexus — Kolleksiya kontenti: chap panel (sarlavha/tavsif/spec) + o'ng
 * to'r (barcha modellar). Ikki joyda ishlatiladi:
 *   1. /catalog/[slug] — alohida sahifa (to'g'ridan-to'g'ri havola/SEO).
 *   2. /catalog — "Посмотреть все" bosilganda sahifa ichida (client-side,
 *      navigatsiyasiz) shu komponent render qilinadi.
 * Shuning uchun bu komponent Header/Toolbar/Footer'siz — faqat kontent.
 */
export default function CatalogCollectionContent({
  collection,
  onBack,
  onOpenProduct,
}: {
  collection: CatalogCollection;
  /** Berilsa, panel tepasida "← Все коллекции" tugmasi chiqadi (in-place holat). */
  onBack?: () => void;
  onOpenProduct?: (product: CatalogProductVariant) => void;
}) {
  return (
    <div className="pb-[87px]">
      <Container>
        <div className="grid grid-cols-12 gap-x-[14px]">
          <aside className="col-span-12 flex flex-col lg:col-span-3 lg:col-start-1 xl:sticky xl:top-[170px] xl:h-fit">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-[20px] flex w-fit items-center gap-[6px] text-[14px] text-[#7E7C78] transition-opacity duration-150 hover:opacity-60"
              >
                <span aria-hidden="true">←</span> Все коллекции
              </button>
            )}

            <CatalogCollectionSidebar collection={collection} />
          </aside>

          <div className="col-span-12 mt-10 lg:col-span-9 lg:col-start-4 lg:mt-0">
            <CatalogCollectionGrid
              collection={collection}
              products={collection.products}
              animateIn
              onOpenProduct={onOpenProduct}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
