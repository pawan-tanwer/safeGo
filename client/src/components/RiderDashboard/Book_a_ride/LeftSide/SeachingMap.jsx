import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { greenIcon, redIcon } from "./mapIcon";

const calcLeft = (expiresAt) =>
  expiresAt
    ? Math.max(0, Math.ceil((new Date(expiresAt) - Date.now()) / 1000))
    : 120;
1;

const SeachingMap = ({ pickup, expiresAt, onCancel, cancelling }) => {
  const [left, setLeft] = useState(calcLeft(expiresAt));

  useEffect(() => {
    const t = setInterval(() => setLeft(calcLeft(expiresAt)), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  if (!pickup) return null;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[pickup.lat, pickup.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[pickup.lat, pickup.lng]} icon={greenIcon} />
      </MapContainer>

      <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
        <span className="absolute h-40 w-40 animate-ping rounded-full bg-emerald-500/30" />
        <span className="absolute h-24 w-24 animate-ping rounded-full bg-emerald-500/40" />
      </div>

      <div className="absolute bottom-4 left-1/2 z-[1000] w-72 -translate-x-1/2 rounded-xl bg-[#0f1a17] p-4 text-center text-white shadow-lg">
        <p className="font-semibold">Searching for nearby drivers...</p>
        <p className="text-sm text-gray-400">{mm}:{ss}</p>
        <button onClick={onCancel} disabled={cancelling}
          className="mt-3 w-full rounded-lg bg-red-600 py-2 disabled:opacity-50">
          {cancelling ? "Cancelling..." : "Cancel Ride"}
        </button>
      </div>      
    </div>
  );
};

export default SeachingMap;
