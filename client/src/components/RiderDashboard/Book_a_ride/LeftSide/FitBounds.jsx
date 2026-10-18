import { useEffect } from "react";
import { useMap } from "react-leaflet";

function FitBounds({ pickup, destination }) {
  const map = useMap();

  useEffect(() => {
    if (pickup && destination) {
      map.fitBounds(
        [
          [pickup.lat, pickup.lng],
          [destination.lat, destination.lng],
        ],
        { padding: [50, 50] }
      );
    }
  }, [pickup, destination, map]);

  return null;
}

export default FitBounds;