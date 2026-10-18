import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const TOTAL_SECONDS = 21;

// One label/value row – value wraps instead of overflowing on small screens
const Row = ({ label, children }) => (
  <div className="flex items-start justify-between gap-3 text-sm">
    <span className="shrink-0 text-gray-300">{label}</span>
    <span className="min-w-0 break-words text-right text-gray-400">
      {children}
    </span>
  </div>
);

function IncomingRideCard({ ride, onDone, setRideRiderData, setRideAccepted }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS); // per-driver countdown
  const [loading, setLoading] = useState(false);
  const { rideUrl, driverUrl, accessToken } = useContext(StoreContext);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDone(); // time over, card removes itself
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  async function handleAccept() {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${rideUrl}/${ride.rideId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log(res);
        toast.success("Ride accepted!");
        setRideAccepted(true);
        console.log("ride data after accept", res?.data);
        setRideRiderData(res?.data?.ride);
        onDone();
      }
    } catch (error) {
      console.error("error :", error);
      toast.error(error.response?.data?.message || "Could not accept ride");
      onDone(); // if someone else already took it, remove the card
    } finally {
      setLoading(false);
    }
  }

  async function handleDecline() {
    try {
      await axios.post(
        `${driverUrl}/rides/${ride.rideId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Decline error:", error);
    } finally {
      onDone();
    }
  }

  const progress = Math.max(0, (timeLeft / TOTAL_SECONDS) * 100);
  const urgent = timeLeft <= 5;

  return (
    <div
      role="alertdialog"
      aria-label="New ride request"
      /* Phone: bottom sheet (thumb-friendly) · sm+: card at top-right.
         z-[2000] keeps it above Leaflet map layers (they go up to z-1000). */
      className="fixed inset-x-3 bottom-3 z-[2000] max-h-[85dvh] overflow-y-auto rounded-2xl border border-emerald-500/40 bg-[#0f1a17] p-4 text-white shadow-2xl shadow-black/60 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-20 sm:w-96 sm:p-5"
    >
      {/* Countdown bar */}
      <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-gray-700/60">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
            urgent ? "bg-red-500" : "bg-emerald-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-base font-bold sm:text-lg">New Ride Request</p>
        <p
          className={`text-sm font-semibold tabular-nums ${
            urgent ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {timeLeft}s
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Row label="Rider:">{ride.riderName}</Row>
        <Row label="Pickup:">{ride.pickupLocation?.address}</Row>
        <Row label="Drop:">{ride.dropLocation?.address}</Row>
        <Row label="Distance to pickup:">{ride.distanceToPickup} km</Row>
      </div>

      <p className="mt-3 text-xl font-semibold text-emerald-400 sm:text-2xl">
        ₹{ride.fare}
      </p>

      <div className="mt-4 flex gap-2 sm:gap-3">
        <button
          onClick={handleAccept}
          disabled={loading}
          className="min-h-11 flex-1 cursor-pointer rounded-full bg-emerald-500 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {loading ? "Accepting..." : "Accept"}
        </button>
        <button
          onClick={handleDecline}
          disabled={loading}
          className="min-h-11 flex-1 cursor-pointer rounded-full border border-gray-500 bg-transparent py-2 text-sm text-gray-300 transition hover:bg-white/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export default IncomingRideCard;