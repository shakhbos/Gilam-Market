"use client";

import GlamCard from "../components/glam-card";
import { Link } from "../i18n/routing";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { changeBuskets, changeLike } from "../lib/features";
import Masonry from "react-masonry-css";
import { minio_img_url } from "@/utils/divice";
import { fetchData } from "../service/get";
import GlamCardSkeleton from "../components/skeletons/glam-card-skeleton";
import { useTranslations } from "next-intl";

export default function HomePage({ product, search }: { product: any, search?: any }) {
  const t = useTranslations('Home');
  const { buskets } = useAppSelector((store) => store.buskets);
  const { likes } = useAppSelector((store) => store.likes);
  const dispatch = useAppDispatch();
  const breakpointColumnsObj = {
    default: 5,
    10680: 10,
    6680: 8,
    3680: 7,
    2680: 6,
    2080: 5,
    1300: 4,
    1000: 3,
    768: 2,
  };

  const [products, setProducts] = useState<any[]>(product || []);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { rootMargin: "1800px" });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setProducts(product || []);
    setPage(2);
    setHasMore(true);
  }, [product]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetchData(`${process.env.NEXT_PUBLIC_URL}/qr-base/i-market`, {
        page: page,
        limit: 10,
        status: "published",
        search: search || undefined,
        // style: searchParams.get('style') || undefined,
        // shape: searchParams.get('shape') || undefined,
        // color: searchParams.get('color') || undefined,
        // width: searchParams.get('width') || undefined,
        // length: searchParams.get('length') || undefined,
      });

      if (res?.items?.length) {
        setProducts((prev) => [...prev, ...res.items]);
        setPage((prev) => prev + 1);
        if (res.items.length < 10) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more products", error);
    } finally {
      setLoading(false);
    }
  };

  const skeletons = Array(4).fill(0);

  return (
    <div className="w-full px-4 sm:px-[30px] mt-[60px] sm:mt-[60px]">
      <header className="mb-[60px] sm:mb-[80px] text-center w-full max-w-[477px] mx-auto px-4 sm:px-[30px]">
        <Link className="w-full inline-block max-w-[220px] mx-auto" href="/">
          <Image
            src={"/logo.svg"}
            width={220}
            height={90}
            alt="Gilam Market"
            title="Gilam Market"
            priority={true}
          />
        </Link>
        <h3 className="text-[17px] leading-[20px] text-[#212121] mt-5 mb-[7px] font-semibold">
          Погрузитесь в мир утончённости!
        </h3>
        <p className="text-normal text-[14px] leading-[16.71px]">
          Турецкие, иранские и узбекские ковры – только премиальное качество и
          доступные цены.
        </p>
      </header>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-8"
        columnClassName="flex flex-col gap-16"
      >
        {products?.map((e) => (
          <GlamCard
            key={e?.id}
            className="colm1"
            url={`/glam/${e?.id}?modelId=${e?.model?.title}&color=${e?.color?.title}&collectionId=${e?.collection?.title}`}
            title={`${e?.collection?.title} ${e?.model?.title}`}
            type={e?.sizeType}
            text={e?.size?.title}
            image={e?.imgUrl?.path ? minio_img_url + e?.imgUrl?.path : ""}
            isLike={likes?.map((it: any) => it?.id)?.includes(e?.id)}
            onLike={() => {
              dispatch(
                likes?.some((itms: any) => itms?.id === e?.id)
                  ? changeLike(likes?.filter((itms: any) => itms?.id !== e?.id))
                  : changeLike([e, ...likes])
              );
            }}
            onBuslet={() => {
              dispatch(
                buskets?.some((itms: any) => itms?.id === e?.id)
                  ? changeBuskets(
                    buskets?.filter((itms: any) => itms?.id !== e?.id)
                  )
                  : changeBuskets([e, ...buskets])
              );
            }}
            isloading={undefined}
          />
        ))}
        {loading && skeletons.map((_, i) => <GlamCardSkeleton key={`skeleton-${i}`} />)}
      </Masonry>

      {/* Sentinel for IntersectionObserver */}
      <div ref={lastElementRef} className="h-10 w-full" />
    </div>
  );
}
