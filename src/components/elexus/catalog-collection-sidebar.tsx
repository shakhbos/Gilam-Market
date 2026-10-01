import type { CatalogCollection } from "@/data/catalog-elexus";

/*
 * Elexus — Kolleksiya sarlavha/tavsif/spec bloki. `catalog-collection-content.tsx`
 * (standalone /catalog/[slug]) VA accordion holatidagi `catalog-collection-row.tsx`
 * (asosiy /catalog sahifasi) IKKISI HAM shu componentni ishlatadi — ikki joyda
 * bir xil matn/uslub takrorlanmasin.
 */
export default function CatalogCollectionSidebar({
  collection,
}: {
  collection: CatalogCollection;
}) {
  return (
    <>
      <p className="text-[16px] font-semibold uppercase leading-[1.2] tracking-[-0.176px] text-black">
        {collection.title}
      </p>

      <div className="mt-[12px] flex flex-col gap-[1em] text-[14px] leading-[1.5] text-[#7E7C78]">
        <p>{collection.description[0]}</p>
        <p>{collection.description[1]}</p>
      </div>

      <dl className="mt-[12px] flex flex-col gap-[12px] text-[14px] leading-[normal]">
        {collection.specs.map((s) => (
          <div key={s.label}>
            <dt className="uppercase text-[#C9C5BF]">{s.label}</dt>
            <dd className="mt-[4px] text-[#7E7C78]">{s.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
