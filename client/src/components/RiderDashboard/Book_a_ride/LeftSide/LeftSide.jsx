import "../../../../utils/LeafLetIconFix";
import { useContext, useEffect, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { StoreContext } from "../../../../context/StoreContext";
import { PiSpinnerGapBold } from "react-icons/pi";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import FitBounds from "./FitBounds";
import { greenIcon, redIcon } from "./mapIcon";
import { Polyline } from "react-leaflet";
import { getRoute } from "./getRoute";
import { Map } from "leaflet";
import RideTrackingMap from "./RideTrackingMap";
import SearchingMap from "./SeachingMap";
import NoDriverFound from "./NoDriverFound";
import ShowOtp from "../ShowOtp";
import VehicleSelector from "./VehicleSelector";
import axios from "axios";

const LeftSide = ({ driverLocation, phase,expiresAt,onCancel,cancelling,driverData ,resetPhase}) => {
  const {
    vehicleType,
    setVehicleType,
    pickupCoords,
    setPickupCoords,
    pickupText,
    setPickupText,
    destinationText,
    setDestinationText,
    destinationCoords,
    setDestinationCoords,
    routeCoords,
    setRouteCoords,
    routeInfo,
    setRouteInfo,
    rideUrl
  } = useContext(StoreContext);
  useEffect(()=>{
    console.log("driverLocation:",driverLocation);
  },[driverLocation])

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const isTracking = ["accepted", "arrived", "ongoing"].includes(phase);

  {
    /**Pickup logic */
  }
  async function reverseGeocode(lat, lng) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    );
    if (!res.ok) throw new Error("Reverse geocode request failed");
    const data = await res.json();
    return data.display_name;
  }

  async function detectCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError("GeoLocation not supported by this browser");
      return;
    }
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);

        try {
          const address = await reverseGeocode(latitude, longitude);
          setPickupText(address);
          setPickupCoords({ lat: latitude, lng: longitude, address: address });
        } catch (error) {
          console.error("Reverse geocode failed:", error);
          setPickupText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        setLocationError("Location access denied. Please enter  manually");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  useEffect(() => {
    detectCurrentLocation();
  }, []);

  {
    /** destionation logic */
  }
  async function fetchDestinationSuggestions(query) {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`,
      );
      const data = await res.json();
      setSuggestions(data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Autocomplete fetch failed:", error);
    }
  }

  function handleDestinationChange(e) {
    const value = e.target.value;
    setDestinationText(value);
    setDestinationCoords(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => fetchDestinationSuggestions(value),
      400,
    );
  }

  function handleDestinationSelect(place) {
    console.log("suggestion select :", place.display_name);
    setDestinationText(place.display_name);
    setDestinationCoords({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      address: place.display_name,
    });
    setShowDropdown(false);
    setSuggestions([]);
  }

  function handlePickupChange(e) {
    setPickupText(e.target.value);
    setPickupCoords(null);
  }

  {
    /**two points ke beech me path show karna */
  }
  useEffect(() => {
    if (pickupCoords && destinationCoords) {
      getRoute(pickupCoords, destinationCoords).then(
        ({ coordinates, distanceKm, distanceMin }) => {
          setRouteCoords(coordinates);
          setRouteInfo({ distanceKm, distanceMin });
        },
      );
    } else {
      setRouteCoords([]);
    }
  }, [pickupCoords, destinationCoords]);

  const [ridePrices,setRidePrices] = useState(null);

  useEffect(()=>{

    if(!destinationCoords)return;

    const rides = async()=>{
      try {
        console.log("api calling");
        const response = await axios.post(`${rideUrl}/ridePrices`,
        {
          pickupLocation: pickupCoords,
          dropLocation:destinationCoords
        },
        {
          withCredentials:true,
        }
      )
      if(response?.data?.success ){
        console.log(response.data.ridePrices)
        setRidePrices(response.data.ridePrices);
      }
      } catch (error) {
        console.error(error?.response?.data?.message || " someting went wrong")
      }

    }
    rides();

  },[destinationCoords])

  return  (
    <div className="flex w-full flex-col">
      {phase === "arrived" && (
        <ShowOtp otp={driverData?.otp} driverName={driverData?.driver?.name} />
      )}

      {/** rider side : give current location and destination location */}
      <div className="flex gap-2 p-3 sm:gap-3 sm:p-4">
        {/* pin icons + dashed connector (stretches with the inputs) */}
        <div className="flex flex-col items-center pb-4 pt-9">
          <FaLocationDot className="shrink-0 text-green-400" />
          <span className="my-1 min-h-8 w-px flex-1 border-l border-dashed border-gray-600" />
          <FaLocationDot className="shrink-0 text-red-400" />
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3">
          <div className="relative flex w-full flex-col items-start justify-center">
            <p>Current Location</p>
            <input
              type="text"
              name="pickup"
              value={pickupText}
              placeholder={
                locationLoading
                  ? "Detecting your location..."
                  : "Enter your location"
              }
              className="w-full rounded border border-gray-600 bg-transparent p-2 text-base outline-none transition-colors focus:border-green-500"
              onChange={(e) => setPickupText(e.target.value)}
            />
            {locationLoading && (
              <PiSpinnerGapBold className="absolute right-3 top-9 animate-spin" />
            )}
          </div>

          {locationError && (
            <p className="text-xs text-red-400">{locationError}</p>
          )}

          <div className="relative flex w-full flex-col items-start justify-center">
            <p>Where to?</p>
            <input
              type="text"
              placeholder="Enter your destination"
              className="w-full rounded border border-gray-600 bg-transparent p-2 text-base outline-none transition-colors focus:border-green-500"
              value={destinationText}
              onChange={handleDestinationChange}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute left-0 top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border border-green-700 bg-[#0f1a17] text-amber-50">
                {suggestions.map((place) => (
                  <li
                    key={place.place_id}
                    onMouseDown={() => handleDestinationSelect(place)}
                    className="cursor-pointer px-3 py-3 text-sm text-white hover:bg-gray-800 sm:py-2"
                  >
                    {place?.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/** select car */}
<div className="mt-2 border-y border-gray-700 xl:mt-6">
  <VehicleSelector value={vehicleType} onChange={setVehicleType} ridePrices={ridePrices} />
</div>

      {/**map image */}
      {/* isolate + z-0 keeps Leaflet's layers below the suggestions dropdown */}
      <div className="relative isolate z-0 h-[340px] w-full overflow-hidden rounded-b-2xl sm:h-[420px] xl:h-[520px]">
        {phase === "searching" ? (
          <SearchingMap
            pickup={pickupCoords}
            expiresAt={expiresAt}
            onCancel={onCancel}
            cancelling={cancelling}
          />
        ) : phase === "noDriver" ? (
          <NoDriverFound onRetry={resetPhase} />
        ) : isTracking ? (
          <RideTrackingMap
            phase={phase}
            driverLocation={driverLocation}
            pickup={pickupCoords}
            destination={destinationCoords}
          />
        ) : pickupCoords && destinationCoords ? (
          <MapContainer
            center={[pickupCoords.lat, pickupCoords.lng]}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[pickupCoords.lat, pickupCoords.lng]}
              icon={greenIcon}
            />
            <Marker
              position={[destinationCoords.lat, destinationCoords.lng]}
              icon={redIcon}
            />
            {routeCoords.length > 0 && (
              <Polyline positions={routeCoords} color="#10b981" weight={4} />
            )}
            <FitBounds pickup={pickupCoords} destination={destinationCoords} />
          </MapContainer>
        ) : pickupCoords ? (
          <MapContainer
            center={[pickupCoords.lat, pickupCoords.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[pickupCoords.lat, pickupCoords.lng]}
              icon={greenIcon}
            />
          </MapContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center text-sm text-amber-100">
            <p>Enter your pickup and destination to see the route</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSide;
