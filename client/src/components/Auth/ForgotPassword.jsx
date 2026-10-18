import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 2))}@${domain}`;
};

const MIN_LEN = 8;

const strengthOf = (p) => {
  let s = 0;
  if (p.length >= MIN_LEN) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s; // 0-4
};

const STRENGTH = [
  ["Too short", "bg-red-500"],
  ["Weak", "bg-red-500"],
  ["Fair", "bg-yellow-500"],
  ["Good", "bg-emerald-500"],
  ["Strong", "bg-emerald-400"],
];

export default function ForgotPassword({
  email,                    // sirf dikhane ke liye                // POST { resetToken, newPassword }     // password badalne ke baad
  onClose, 
  setShowPassword                 // optional: "Cancel"
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {authUrl} = useContext(StoreContext);

  const strength = strengthOf(password);
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = password.length >= MIN_LEN && password === confirm && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setLoading(true);
      setError("");
      await axios.post(
        `${authUrl}/forgot-password`,
        {
            password: password,
            email:email
         },
        { withCredentials: true }
      );
      toast.success("Password updated. Please login.");
      setShowPassword(false);
      navigate("/auth");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-700 bg-black/30 px-4 py-3 pr-12 text-white outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="fixed inset-0 z-[3000] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fp-title"
        className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl border border-emerald-700 bg-[#0f1a17] p-5 text-white sm:max-w-sm sm:rounded-2xl sm:p-6"
      >
        <h2 id="fp-title" className="text-lg font-bold sm:text-xl">
          Set a new password
        </h2>
        <p className="mt-1 text-sm text-gray-400">Resetting password for</p>
        <p className="break-all font-semibold text-emerald-400">{maskEmail(email)}</p>

        {/* New password */}
        <div className="relative mt-5">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="New password"
            autoComplete="new-password"
            autoFocus
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Strength bar */}
        {password && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded ${
                    i < strength ? STRENGTH[strength][1] : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-400">{STRENGTH[strength][0]}</p>
          </div>
        )}

        {/* Confirm */}
        <input
          type={show ? "text" : "password"}
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setError("");
          }}
          placeholder="Confirm new password"
          autoComplete="new-password"
          className={`${inputCls} mt-3`}
        />
        {mismatch && <p className="mt-1 text-xs text-red-400">Passwords do not match</p>}

        <p className="mt-2 text-xs text-gray-500">
          Minimum {MIN_LEN} characters. Use letters, numbers and a symbol.
        </p>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 w-full rounded-lg bg-emerald-600 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update password"}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full text-center text-xs text-gray-500 underline"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}