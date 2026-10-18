import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { greenIcon, redIcon, carIcon } from "./mapIcon"; // carIcon pichle message wala

const ROUTE_REFETCH_MS = 20000;

// On touch screens: one finger scrolls the PAGE, two fingers move/zoom the MAP.
// (Otherwise the map "traps" the scroll on phones.) Set to false to allow one-finger panning.
const TWO_FINGER_MAP_ON_TOUCH = true;

// Fit padding scales with the map size: 50px on big maps, ~24px on small phones
function fitPadding(map) {
  const { x, y } = map.getSize();
  const p = Math.max(24, Math.min(50, Math.round(Math.min(x, y) * 0.12)));
  return [p, p];
}

function FitOnPhase({ points, phase }) {
  const map = useMap();
  const pointsRef = useRef(points);
  pointsRef.current = points;

  const fit = () => {
    const pts = pointsRef.current;
    // maxZoom stops the map zooming to street-corner level when driver is at the pickup
    if (pts.length >= 2) map.fitBounds(pts, { padding: fitPadding(map), maxZoom: 17 });
  };

  // har location update pe nahi, sirf phase change pe
  useEffect(() => {
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, points.length]);

  // Container size changed (phone rotated, breakpoint switch, ride card appeared)
  useEffect(() => {
    const el = map.getContainer();
    let timer;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        map.invalidateSize();
        fit();
      }, 150);
    });
    ro.observe(el);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

// driverLocation, pickup, destination: sab { lat, lng }
export default function RideTrackingMap({ phase, driverLocation, pickup, destination }) {
  const [route, setRoute] = useState([]);
  const last = useRef({ phase: null, time: 0 });
  const reqId = useRef(0);

  const ongoing = phase === "ongoing";
  const target = ongoing ? destination : pickup;

  useEffect(() => {
    if (!driverLocation || !target) return;
    const now = Date.now();
    if (last.current.phase === phase && now - last.current.time < ROUTE_REFETCH_MS) return;
    last.current = { phase, time: now };

    const id = ++reqId.current;
    const url = `https://router.project-osrm.org/route/v1/driving/${driverLocation.lng},${driverLocation.lat};${target.lng},${target.lat}?overview=full&geometries=geojson`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (id !== reqId.current) return; // purana response ignore
        const coords = d.routes?.[0]?.geometry?.coordinates;
        if (coords) setRoute(coords.map(([lng, lat]) => [lat, lng])); // OSRM [lng,lat] -> Leaflet [lat,lng]
      })
      .catch(console.error);
  }, [phase, driverLocation, target]);

  if (!pickup) return null;

  const driverPos = driverLocation ? [driverLocation.lat, driverLocation.lng] : null;
  const targetPos = target ? [target.lat, target.lng] : null;

  return (
    <MapContainer
      center={[pickup.lat, pickup.lng]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      dragging={!(TWO_FINGER_MAP_ON_TOUCH && L.Browser.mobile)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {driverPos && <Marker position={driverPos} icon={carIcon} />}
      {targetPos && <Marker position={targetPos} icon={ongoing ? redIcon : greenIcon} />}
      {route.length > 0 && <Polyline positions={route} color="#10b981" weight={4} />}
      <FitOnPhase points={driverPos && targetPos ? [driverPos, targetPos] : []} phase={phase} />
    </MapContainer>
  );
}