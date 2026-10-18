import { useState } from "react";

export default function ShowOtp({ otp, driverName }) {
  const [hidden, setHidden] = useState(false);
  if (!otp || hidden) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-emerald-600 bg-[#0f1a17] p-6 text-center">
        <p className="text-sm text-gray-400">
          {driverName ? `${driverName} has arrived` : "Your driver has arrived"}
        </p>
        <p className="mt-1 font-semibold text-white">Share this OTP with the driver</p>

        <div className="mt-4 flex justify-center gap-2">
          {String(otp).split("").map((d, i) => (
            <span key={i} className="flex h-14 w-11 items-center justify-center rounded-lg bg-black text-3xl font-bold text-emerald-400">
              {d}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-500">Share it only after you are in the vehicle.</p>
        <button onClick={() => setHidden(true)} className="mt-4 text-sm text-gray-400 underline">
          Hide
        </button>
      </div>
    </div>
  );
}