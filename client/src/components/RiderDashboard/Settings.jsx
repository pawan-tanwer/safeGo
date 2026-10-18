import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";

const inputCls =
  "w-full rounded-lg bg-[#0f1a17] px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500";

const ToggleRow = ({ label, hint }) => (
  <label className="flex cursor-pointer items-center justify-between py-3">
    <div>
      <p>{label}</p>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
    <span className="relative inline-block h-6 w-11">
      <input type="checkbox" className="peer sr-only" />
      <span className="absolute inset-0 rounded-full bg-gray-600 transition peer-checked:bg-emerald-600" />
      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
    </span>
  </label>
);

export default function Settings() {
  const { authUrl, accessToken } = useContext(StoreContext);
  const [data, setData] = useState({
    name: "",
    oldPassword: "",
    newPassword: "",
    phone: "",
  });
  const onChangeHandler = (e) => {
    const { value, name } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${authUrl}/update`,
        {
          name: data?.name,
          oldPassword: data?.oldPassword,
          nedwPassword: data?.newPassword,
          phone: data?.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data?.success) {
        toast.success(response?.data?.message);
        setData({
          name: "",
          oldPassword: "",
          newPassword: "",
          phone: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error)
    }
  };
  return (
    <div className="mx-auto max-w-3xl space-y-8 text-white">
      <h1 className="text-2xl font-bold">Settings</h1>

      <form
        onSubmit={onSubmitHandler}
        className="space-y-3 rounded-xl border border-gray-700 p-4"
      >
        <h2 className="text-lg font-semibold">Profile</h2>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={onChangeHandler}
          placeholder="Full name"
          className={inputCls}
        />
        <input
          inputMode="numeric"
          value={data.phone}
          onChange={onChangeHandler}
          name="phone"
          placeholder="Phone number"
          className={inputCls}
        />
        <button
          type="submit"
          className="rounded-lg cursor-pointer bg-emerald-600 px-6 py-2 font-semibold"
        >
          Save
        </button>
      </form>

      <section className="rounded-xl border border-gray-700 px-4 py-2">
        <h2 className="pt-2 text-lg font-semibold">Preferences</h2>
        <div className="divide-y divide-gray-700">
          <ToggleRow label="Ride alerts sound" />
          <ToggleRow
            label="Share trip with trusted contact"
            hint="Coming soon"
          />
        </div>
      </section>

      <form
        onSubmit={onSubmitHandler}
        className="space-y-3 rounded-xl border border-gray-700 p-4"
      >
        <h2 className="text-lg font-semibold">Change password</h2>
        <input
          type="password"
          name="oldPassword"
          value={data?.oldPassword}
          onChange={onChangeHandler}
          placeholder="Current password"
          autoComplete="current-password"
          className={inputCls}
        />
        <input
          type="password"
          name="newPassword"
          value={data?.newPassword}
          onChange={onChangeHandler}
          placeholder="New password"
          autoComplete="new-password"
          className={inputCls}
        />
        <button
          type="submit"
          className="rounded-lg cursor-pointer bg-emerald-600 px-6 py-2 font-semibold"
        >
          Update password
        </button>
      </form>

      <button className="w-full rounded-lg border border-red-600 py-3 font-semibold text-red-400">
        Log out
      </button>
    </div>
  );
}
