import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

// pa****@gmail.com
const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const shown = name.slice(0, 2);
  return `${shown}${"*".repeat(Math.max(name.length - 2, 2))}@${domain}`;
};

export default function OtpVerify({ email, onClose, setShowPassword }) {
  const { authUrl } = useContext(StoreContext);
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const inputs = useRef([]);

  const otp = digits.join("");

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const clearBoxes = () => {
    setDigits(Array(OTP_LENGTH).fill(""));
    inputs.current[0]?.focus();
  };

  const setAt = (i, v) =>
    setDigits((p) => {
      const n = [...p];
      n[i] = v;
      return n;
    });

  const handleChange = (i, e) => {
    const v = e.target.value.replace(/\D/g, "");
    if (!v) return setAt(i, "");
    setAt(i, v[v.length - 1]);
    setError("");
    if (i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0)
      inputs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < OTP_LENGTH - 1)
      inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    text.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    inputs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    console.log("opt :", otp);
    if (loading) return;
    if (otp.length !== OTP_LENGTH)
      return setError(`Enter the ${OTP_LENGTH}-digit OTP`);
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        `${authUrl}/verify-forgotPassword-otp`,
        { email, otp },
        { withCredentials: true },
      );
      if(res.data.success){
        toast.success("Email verified");
      onClose();
      setShowPassword(true);
      }
     // sirf API success ke baad
    } catch (error) {

      toast.error(error.response?.data?.message)
      setError(error.response?.data?.message || "Invalid or expired OTP");
      clearBoxes();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    try {
      setResending(true);
      setError("");
      await axios.post(resendUrl, { email }, { withCredentials: true });
      toast.success("OTP sent again");
      setTimer(RESEND_SECONDS);
      clearBoxes();
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 border z-3000 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        onSubmit={handleVerify}
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-title"
        className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl border border-emerald-700 bg-[#0f1a17] p-5 text-white sm:max-w-sm sm:rounded-2xl sm:p-6"
      >
        <h2 id="otp-title" className="text-lg font-bold sm:text-xl">
          Verify your email
        </h2>
        <p className="mt-1 text-sm text-gray-400">We sent a 6-digit code to</p>
        <p className="font-semibold text-emerald-400 break-all">
          {maskEmail(email)}
        </p>

        <div className="mt-5 flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              className="h-12 w-full min-w-0 rounded-lg border border-gray-700 bg-black/30 text-center text-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 sm:h-14 sm:text-2xl"
            />
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || otp.length !== OTP_LENGTH}
          className="mt-5 w-full rounded-lg bg-emerald-600 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || resending}
          className="mt-3 w-full text-sm text-gray-400 disabled:opacity-50"
        >
          {resending
            ? "Sending..."
            : timer > 0
              ? `Resend OTP in ${timer}s`
              : "Resend OTP"}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full text-center text-xs text-gray-500 underline"
          >
            Wrong email? Go back
          </button>
        )}
      </form>
    </div>
  );
}
