"use client";
import GlamCard from "../components/glam-card";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { changeBuskets, changeLike } from "../lib/features";
import { minio_img_url } from "@/utils/divice";
import Masonry from "react-masonry-css";

export default function LikesPage() {
  const { likes } = useAppSelector((store) => store.likes);
  const { buskets } = useAppSelector((store) => store.buskets)
  const dispatch = useAppDispatch();
  const [isloading, setIsloading] = useState(true)
  const breakpointColumnsObj = {
    default: 4,
    // 1280: 4,
    1024: 3,
    768: 2,
    640: 2,
  };

  setTimeout(() => {
    setIsloading(false)
  }, 300)
  return (
    <div className="w-full gap-3 items-start flex flex-wrap ">

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-full gap-8"
        columnClassName="flex w-full flex-col gap-16"
      >
        {likes?.map((e) => (
          <GlamCard
            isloading={isloading}
            key={e?.id}
            className=""
            url={`/glam/${e?.id}?modelId=${e?.model?.title}&color=${e?.color?.title}&collectionId=${e?.collection?.title}`}
            title={`${e.collection?.title} ${e?.model?.title}`}
            type={e?.sizeType}
            text={e?.size?.title}

            image={e?.imgUrl?.path ? minio_img_url + e?.imgUrl?.path : ""}
            isLike={true}
            onBuslet={() => {
              dispatch(
                buskets?.includes(e)
                  ? changeBuskets(
                    buskets?.filter((itms) => itms?.id !== e?.id)
                  )
                  : changeBuskets([e, ...buskets])
              );
            }}
            onLike={() => {
              dispatch(
                likes?.includes(e)
                  ? changeLike(likes?.filter((itms) => itms?.id !== e?.id))
                  : changeLike([e, ...likes])
              );
            }} />
        ))}
      </Masonry>
    </div>
  );
}
