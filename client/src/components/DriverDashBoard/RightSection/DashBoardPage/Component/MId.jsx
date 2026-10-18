import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "../../../../../utils/LeafLetIconFix";
import { carIcon } from "../../../../RiderDashboard/Book_a_ride/LeftSide/mapIcon";
import { MdSupportAgent } from "react-icons/md";
import Ride from "./MidLeft_Compontents/Ride";
import NoRide from "./MidLeft_Compontents/NoRide";
import RideTrackingMap from "../../../../RiderDashboard/Book_a_ride/LeftSide/RideTrackingMap";
import { toLatLng } from "../../../../../utils/toLatLng";

const MId = ({ driverCoordinates, riderData, setRiderData }) => {
  const phase = riderData?.status;
  const isTracking = ["accepted", "arrived", "ongoing"].includes(phase);

  return (
    <div className="mt-4 flex flex-col gap-4 lg:mt-6 lg:flex-row lg:items-start lg:gap-6">
      {/* Map */}
      <div className="relative isolate z-0 h-[300px] w-full overflow-hidden rounded-2xl border border-gray-600/60 bg-[#0f1a17] sm:h-[400px] lg:h-[500px] lg:min-w-0 lg:flex-1">
        {isTracking ? (
          <RideTrackingMap
            phase={phase}
            driverLocation={driverCoordinates}
            pickup={toLatLng(riderData.pickupLocation)}
            destination={toLatLng(riderData.dropLocation)}
          />
        ) : driverCoordinates?.lat ? (
          <MapContainer
            center={[driverCoordinates.lat, driverCoordinates.lng]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[driverCoordinates.lat, driverCoordinates.lng]}
              icon={carIcon}
            />
          </MapContainer>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-gray-400">
            <MdSupportAgent className="text-3xl sm:text-4xl" />
            <p className="text-sm">Go online to see your live location</p>
          </div>
        )}
      </div>

      {/* Side panel: ride details or tips.
          On mobile, an active ride is shown ABOVE the map so the driver
          sees the action buttons / OTP form first. */}
      <div
        className={`w-full lg:max-h-[500px] lg:w-[340px] lg:shrink-0 lg:overflow-y-auto xl:w-[380px] ${
          riderData ? "order-first lg:order-none" : ""
        }`}
      >
        {riderData ? (
          <Ride
            rideData={riderData}
            setRideData={setRiderData}
            driverCoordinates={driverCoordinates}
          />
        ) : (
          <NoRide />
        )}
      </div>
    </div>
  );
};

export default MId;