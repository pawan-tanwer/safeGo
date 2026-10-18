import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-gray-700 bg-[#0f1a17] p-4">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </div>
);

const tabCls = (active) =>
  `rounded-lg px-4 py-2 text-sm font-semibold ${
    active ? "bg-emerald-600 text-white" : "bg-[#0f1a17] text-gray-400"
  }`;

const PERIODS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export default function Earning() {
  const { driverUrl, accessToken } = useContext(StoreContext);

  const [period, setPeriod] = useState("today");
  const [earning, setEarning] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const loadEarning = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${driverUrl}/earning`,
          { period },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          },
        );
        console.log("earning :", res.data);
        if (!ignore) setEarning(res.data);
      } catch (error) {
        if (!ignore)
          toast.error(error.response?.data?.message || "could not load earnig");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadEarning();
    return () => {
      ignore = true;
    };
  }, [period, driverUrl, accessToken]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Earning</h1>
        <div className="flex gap-2">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`${tabCls(period === value)} cursor-pointer`}
              onClick={() => setPeriod(value)}
              aria-pressed={period === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Gross fare"
          value={`₹${earning?.grossFare ?? 0}`}
          hint="Total fare of completed rides"
        />
        <StatCard
          label="Commission"
          value={`₹${earning?.commission ?? 0}`}
          hint="Platform share"
        />
        <StatCard
          label="Net earning"
          value={`₹${earning?.netEarning ?? 0}`}
          hint="Gross minus commission"
        />
        <StatCard
          label="Rides completed"
          value={earning?.ridesCompleted ?? 0}
        />
      </section>

      {/* Wallet */}
      <section className="rounded-xl border border-gray-700 bg-[#0f1a17] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Wallet balance</p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">₹0</p>
            <p className="mt-1 text-xs text-gray-500">
              Commission on cash rides is deducted from this balance.
            </p>
          </div>
          <button className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold">
            Add money
          </button>
        </div>
      </section>

      {/* Chart placeholder */}
      <section className="rounded-xl border border-gray-700 p-5">
        <h2 className="mb-4 text-lg font-semibold">Earning trend</h2>
        <div className="flex h-40 items-end gap-2">
          {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-emerald-600/70"
                style={{ height: `${h}%` }}
              />
              <span className="text-xs text-gray-500">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Sample bars. Replace with real data.
        </p>
      </section>

      {/* Ride-wise table */}
      <section className="rounded-xl border border-gray-700">
        <h2 className="px-5 pt-4 text-lg font-semibold">Ride-wise earnings</h2>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Route</th>
                <th className="px-3 py-2 font-medium">Fare</th>
                <th className="px-3 py-2 font-medium">Commission</th>
                <th className="px-3 py-2 font-medium">Net</th>
                <th className="px-3 py-2 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-gray-500">
                  No completed rides yet. Your earnings will appear here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
