import { MdCall } from "react-icons/md";
import { FaUser } from "react-icons/fa";

// One label/value row: stacked on very small phones, side by side from sm up.
// Long values (addresses) wrap instead of overflowing.
const Row = ({ label, children, valueClass = "text-white" }) => (
  <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
    <span className="shrink-0 text-sm text-gray-400 sm:text-base">{label}</span>
    <span
      className={`min-w-0 break-words text-base font-medium sm:text-right sm:text-lg ${valueClass}`}
    >
      {children}
    </span>
  </div>
);

const Driver = ({ driverData }) => {
  const driver = driverData?.driver;
  const car = driverData?.carDetails;
  const ride = driverData?.rideDetails;

  return (
    <div className="flex w-full flex-col items-start p-1">
      {/* Driver details */}
      <div className="flex w-full flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <FaUser className="size-10 shrink-0 rounded-full bg-gray-400 p-2 sm:size-11" />
          <div className="min-w-0">
            <p className="text-lg font-medium text-gray-500 sm:text-xl">
              Driver Details :
            </p>
            <p className="truncate text-lg font-medium text-gray-200 sm:text-xl">
              {driver?.name}
            </p>
          </div>
        </div>

        <div className="mt-1 divide-y divide-gray-700/50">
          <Row label="Car:">
            {car?.make} {car?.model}
          </Row>
          <Row label="Car Number:">{car?.vehicleNumber}</Row>
          <Row label="Car Color:">{car?.color} color</Row>
          <Row label="Driver Contact:">
            {driver?.phone ? (
              <a
                href={`tel:+91${driver.phone}`}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <MdCall className="size-5 text-green-500 sm:size-6" />
                +91 {driver.phone}
              </a>
            ) : (
              "--"
            )}
          </Row>
        </div>
      </div>

      {/* Ride details */}
      <div className="flex w-full flex-col gap-1 border-t-2 border-gray-700 p-3 sm:p-4">
        <h2 className="text-xl font-medium text-green-400 sm:text-2xl">
          Ride Details :
        </h2>
        <div className="divide-y divide-gray-700/50">
          <Row label="PickUp Location:">{ride?.pickupLocation?.address}</Row>
          <Row label="Drop-off Location:">{ride?.dropLocation?.address}</Row>
          <Row label="Distance:">{ride?.distance} KM</Row>
          <Row label="Fare:" valueClass="text-green-400">
            {ride?.fare} ₹
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Driver;