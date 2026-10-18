import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

// ---- Dummy data: API banne par yeh teen hata dena ----
const DUMMY_STATS = {
  totalRides: 12,
  completed: 10,
  totalSpent: 8450,
  lastRide: "10 Oct, 4:20 PM",
};

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-gray-700/50 ${className}`} />
);

const StatSkeleton = () => (
  <div className="rounded-xl border border-gray-700 bg-[#0f1a17] p-4">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="mt-3 h-7 w-24" />
  </div>
);

const DUMMY_ACTIVE_RIDE = null; // test ke liye object do:
// { status: "accepted", driverName: "Pawan", carNumber: "GD32HJ2342", pickup: "Tilak Nagar", drop: "Sohna" }

const RideSkeleton = () => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-700 bg-[#0f1a17] p-4">
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-20" />
    </div>
    <div className="space-y-2">
      <Skeleton className="ml-auto h-4 w-16" />
      <Skeleton className="ml-auto h-3 w-12" />
    </div>
  </div>
);

const rupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const ACTIVE_TEXT = {
  accepted: "Driver is on the way",
  arrived: "Driver has arrived",
  ongoing: "Ride in progress",
};

const STATUS_CLS = {
  completed: "bg-emerald-900/50 text-emerald-400",
  cancelled: "bg-red-900/40 text-red-400",
};

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-gray-700 bg-[#0f1a17] p-4">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </div>
);

export default function RightSide() {
  const { userData, rideUrl, accessToken,setActive } = useContext(StoreContext);
  const [rideData, setRideData] = useState(null);
  const [rides, setRides] = useState(null);
  const [isRideExist, setIsRideExist] = useState(false);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
  const activeRide = DUMMY_ACTIVE_RIDE;

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        })
      : "--";
  const shortAddr = (a) => (a ? a.split(",")[0] : "--");

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${rideUrl}/rideDetails`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        if (cancelled) return;
        if (res.data.success) {
          console.log(res.data)
          setRideData(res.data.rides); // summary object
          setRides(res.data.totalRides); // array
        }
      } catch (err) {
        if (!cancelled) setError("Could not load your rides");
        console.error("ride fetching error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  useEffect(()=>{
    console.log("rideData:",rideData);
  },[rideData])

  return (
    <div className="mx-auto max-w-5xl space-y-8 text-white">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">Hello {userData?.name} 👋</h1>
        <p className="text-gray-400">Where are you going today?</p>
      </div>

      {/* Active ride (sirf tab jab ride chal rahi ho) */}
      {activeRide && (
        <section className="rounded-xl border border-emerald-600 bg-[#0f1a17] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-xs text-emerald-400">
                {ACTIVE_TEXT[activeRide.status]}
              </span>
              <p className="mt-2 font-semibold">
                {activeRide.driverName}
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {activeRide.carNumber}
                </span>
              </p>
              <p className="text-sm text-gray-400">
                {activeRide.pickup} → {activeRide.drop}
              </p>
            </div>
            <button className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold">
              Track ride
            </button>
          </div>
        </section>
      )}

      {/* Where to */}
      <section className="flex flex-col gap-3 rounded-xl border border-gray-700 bg-[#0f1a17] p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-lg bg-black/30 px-4 py-3 text-gray-400">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          Where to?
        </div>
        <button className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold cursor-pointer" onClick={()=>setActive("BookRide")}>
          Book a ride
        </button>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total rides" value={rideData?.rides} />
        <StatCard label="Completed" value={rideData?.completed} />
        <StatCard
          label="Total spent"
          value={rupee(rideData?.totalSpent)}
          hint="Completed rides only"
        />
        <StatCard
          label="Last ride"
          value={rideData?.lastRideDate[0]?.completedAtText}
        />
      </section>

      {/* Payment method */}
      <section className="flex items-center justify-between rounded-xl border border-gray-700 px-4 py-3">
        <div>
          <p className="text-sm text-gray-400">Payment method</p>
          <p className="font-semibold">Cash</p>
        </div>
        <span className="text-xs text-gray-500">
          Pay the driver at the end of the ride
        </span>
      </section>

      {/* Safety strip */}
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["OTP-verified rides", "Ride starts only with your OTP"],
          ["Live trip tracking", "Watch your driver on the map"],
          ["Cancel before pickup", "Free until the ride starts"],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-xl border border-emerald-900 bg-[#0f1a17] p-4"
          >
            <p className="font-semibold text-emerald-400">{title}</p>
            <p className="mt-1 text-xs text-gray-400">{desc}</p>
          </div>
        ))}
      </section>

      {/* Recent rides */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent rides</h2>
          <button className="text-sm text-emerald-400">View all</button>
        </div>

        <div className="space-y-3">
          {loading ? (
            [0, 1, 2].map((i) => <RideSkeleton key={i} />)
          ) : error ? (
            <p className="rounded-xl border border-red-900 p-6 text-center text-red-400">
              {error}
            </p>
          ) : rides.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-700 p-8 text-center text-gray-400">
              No rides yet. Book your first ride.
            </div>
          ) : (
            rides.map((r) => (
              <div
                key={r._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-700 bg-[#0f1a17] p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm text-gray-400">
                    {formatDate(r.createdAt)}
                  </p>
                  <p className="truncate font-semibold">
                    {shortAddr(r.pickupLocation?.address)} →{" "}
                    {shortAddr(r.dropLocation?.address)}
                  </p>
                  <p className="text-xs capitalize text-gray-500">
                    {r.vehicleType} · {r.distance} km
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold">{rupee(r.fare)}</p>
                  <p className="text-xs capitalize text-gray-400">
                    {r.paymentMethod}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_CLS[r.status] || "bg-gray-700 text-gray-300"}`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
