"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "@/lib/leaflet-icons";
import { reverseGeocode } from "@/lib/reverseGeocode";
import type { LatLngTuple } from "leaflet";

// Internal component to handle map logic
function MapController({ onSelect }: { onSelect: (lat: number, lng: number, address: string) => void }) {
  const [position, setPosition] = useState<LatLngTuple | null>(null);
  const map = useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      const address = await reverseGeocode(lat, lng);
      onSelect(lat, lng, address);
    },
    locationfound(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      map.flyTo(e.latlng, map.getZoom());
      reverseGeocode(lat, lng).then((address) => {
        onSelect(lat, lng, address);
      });
    },
  });

  const handleLocateMe = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent map click
    e.preventDefault()
    map.locate({ setView: true, maxZoom: 16 });
  };

  // Auto-locate on mount
  useState(() => {
    map.locate({ setView: true, maxZoom: 16 });
  });

  return (
    <>
      {position && <Marker position={position} />}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <button
          onClick={handleLocateMe}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center gap-2 text-sm font-medium"
          type="button"
        >
          <span>📍</span> Where am I
        </button>
      </div>
    </>
  );
}

export default function MapPicker({ onSelect }: { onSelect: (lat: number, lng: number, address: string) => void }) {
  return (
    <MapContainer
      center={[41.2995, 69.2401] as LatLngTuple} // Tashkent default
      zoom={13}
      className="h-[400px] w-full rounded-lg relative"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController onSelect={onSelect} />
    </MapContainer>
  );
}
