import { useEffect, useRef, useState } from "react";
import { FaPhoneAlt, FaShieldAlt, FaSms } from "react-icons/fa";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const inputCls =
  "w-full rounded-lg border border-gray-700 bg-[#0f1a17] px-4 py-3 text-base text-white outline-none focus:ring-2 focus:ring-emerald-500";

const REASONS = [
  {
    icon: FaPhoneAlt,
    title: "Stay connected",
    desc: "Your driver or rider can call you if they cannot find the pickup point.",
  },
  {
    icon: FaShieldAlt,
    title: "Safer rides",
    desc: "A verified number helps us confirm real users and prevent fake accounts.",
  },
  {
    icon: FaSms,
    title: "Ride updates",
    desc: "Receive important details about your ride on this number.",
  },
];

export default function PhoneVerify({
  initialPhone = "",
  loading = false,
  error = "",
  step: stepProp, // optional: parent se "phone" | "otp"
  onSendOtp = () => {}, // (phone) => void
  onVerify = () => {}, // (phone, otp) => void
  onResend = () => {}, // (phone) => void
  onLogout, // optional
}) {
  const [stepState, setStepState] = useState("phone");
  const step = stepProp || stepState;

  const [phone, setPhone] = useState(initialPhone.replace(/\D/g, "").slice(-10));
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const otpRef = useRef(null);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  useEffect(() => {
    if (step === "otp") otpRef.current?.focus();
  }, [step]);

  const handleSend = (e) => {
    e.preventDefault();
    if (phone.length !== 10 || loading) return;
    onSendOtp(phone);
    setStepState("otp");
    setOtp("");
    setTimer(RESEND_SECONDS);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH || loading) return;
    onVerify(phone, otp);
  };

  const handleResend = () => {
    if (timer > 0 || loading) return;
    onResend(phone);
    setOtp("");
    setTimer(RESEND_SECONDS);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-end justify-center bg-black/40 backdrop-blur-sm p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-verify-title"
        className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl border border-emerald-700 bg-[#0f1a17] p-5 text-white sm:max-w-md sm:rounded-2xl sm:p-6"
      >
        <h2 id="phone-verify-title" className="text-lg font-bold sm:text-xl">
          Verify your mobile number
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Your driver or rider will use this number to contact you during a ride.
        </p>

        {/* Why it matters (desktop/tablet pe dikhta hai) */}
        <ul className="mt-4 hidden space-y-3 rounded-xl bg-black/30 p-4 text-sm sm:block">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-3">
              <Icon className="mt-1 shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-gray-400">{desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {step === "phone" ? (
          <form onSubmit={handleSend} className="mt-5 space-y-3">
            <div className="flex gap-2">
              <span className="flex items-center rounded-lg border border-gray-700 bg-black/30 px-3 text-gray-300">
                +91
              </span>
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="Mobile number"
                autoFocus
                className={inputCls}
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full rounded-lg bg-emerald-600 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-5 space-y-3">
            <p className="text-sm text-gray-400">
              OTP sent to <span className="text-white">+91 {phone}</span>{" "}
              <button
                type="button"
                onClick={() => {
                  setStepState("phone");
                  setOtp("");
                }}
                className="text-emerald-400 underline"
              >
                Change
              </button>
            </p>

            <input
              ref={otpRef}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
              }
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              placeholder="------"
              className={`${inputCls} text-center text-2xl tracking-[0.4em] sm:tracking-[0.5em]`}
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading || otp.length !== OTP_LENGTH}
              className="w-full rounded-lg bg-emerald-600 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0 || loading}
              className="w-full text-sm text-gray-400 disabled:opacity-50"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-xs text-gray-500">
          Your number is shared only with the driver or rider of your ride.
        </p>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="mt-3 w-full text-center text-xs text-gray-500 underline"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}