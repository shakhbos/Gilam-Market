"use client";

import { Modal } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import Image from "next/image";
const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
});

export default function LocationModal({location,setLocation}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex gap-3 cursor-pointer items-center px-4 h-12 border-[#DFF2EE] border bg-[#EDFBF8]"
      >
        <Image width={24} height={24} alt="image" src={"/location.svg"} />

        <p className="text-[12px]">Указать на карте</p>
      </div>
      <Modal
        title="Выберите местоположение"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        width={800}
      >
        <MapPicker
          onSelect={(lat, lng,address) => {
            setLocation({ lat, lng ,address});
          
          }}
        />

        {location && (
          <div className="mt-3 text-sm">
            📍 <b>Lat:</b> {location.lat} <b>Lng:</b> {location.lng}
          </div>
        )}
      </Modal>
    </>
  );
}
