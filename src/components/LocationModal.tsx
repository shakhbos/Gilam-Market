"use client";

import { Modal } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

interface LocationValue {
  lat?: number;
  lng?: number;
  address?: string;
}

interface Props {
  location: LocationValue | null;
  setLocation: (v: LocationValue) => void;
}

export default function LocationModal({ location, setLocation }: Props) {
  const t = useTranslations("Location");
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex gap-3 cursor-pointer items-center px-4 h-12 border-[#DFF2EE] border bg-[#EDFBF8]"
      >
        <Image width={24} height={24} alt="pin" src={"/location.svg"} />
        <p className="text-[12px]">{t("openOnMap")}</p>
      </div>
      <Modal
        title={t("modalTitle")}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        okText={t("confirm")}
        cancelText={t("cancel")}
        width={800}
      >
        <MapPicker
          onSelect={(lat: number, lng: number, address?: string) => {
            setLocation({ lat, lng, address });
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
