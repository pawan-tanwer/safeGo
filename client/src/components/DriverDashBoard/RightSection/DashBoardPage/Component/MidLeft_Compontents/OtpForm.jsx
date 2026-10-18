import { useState, useRef } from "react";
import axios from "axios";
import {toast} from "react-toastify" // jo library tum use karte ho

const OTP_LENGTH = 6;

export default function OtpForm({ rideId, rideUrl, accessToken, onStarted = () => {} }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH));
    setError("");
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit OTP`);
      return;
    }

    try {
      setLoading(true);
      console.log("Starting ride with OTP:", otp);
      await axios.post(
        `${rideUrl}/${rideId}/startRide`,
        { otp },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      toast.success("Ride started");
      onStarted(); // parent status ko "ongoing" karega, sirf API success ke baad
    } catch (err) {
      const msg = err.response?.data?.message || "Could not start ride";
      setError(msg);
      toast.error(msg);
      setOtp("");
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleStart} className="mt-4 rounded-xl border border-gray-700 p-4">
      <p className="mb-1 font-semibold text-white">Ask the rider for the OTP</p>
      <p className="mb-3 text-sm text-gray-400">Enter it to start the ride.</p>

      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        maxLength={OTP_LENGTH}
        value={otp}
        onChange={handleChange}
        placeholder="------"
        className="w-full rounded-lg bg-[#0f1a17] px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none focus:ring-2 focus:ring-emerald-500"
      />

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading || otp.length !== OTP_LENGTH}
        className="mt-4 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Start Ride"}
      </button>
    </form>
  );
}