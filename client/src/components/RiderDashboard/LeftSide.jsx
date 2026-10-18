import React, { useContext, useState } from "react";
import {
  MdHomeFilled,
  MdOutlineContactSupport,
  MdLogout,
} from "react-icons/md";
import { FaCarRear } from "react-icons/fa6";
import { IoSettingsSharp, IoClose } from "react-icons/io5";
import { FaShieldAlt } from "react-icons/fa";
import { StoreContext } from "../../context/StoreContext";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// `key` must match the keys of navList in RiderDashboard.jsx
const navItems = [
  { key: "Home", label: "Home", Icon: MdHomeFilled },
  { key: "BookRide", label: "Book a Ride", Icon: FaCarRear },
  { key: "Support", label: "Support", Icon: MdOutlineContactSupport },
  { key: "Settings", label: "Settings", Icon: IoSettingsSharp },
];

/*
  Phone  (< md)  : slide-in drawer (opened by the hamburger in RiderDashboard)
  Tablet (md)    : slim icon-only rail
  Laptop (lg+)   : full sidebar with labels
*/
const LeftSide = ({ isOpen = false, setIsOpen }) => {
  const { active, setActive, authUrl, accessToken } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const close = () => setIsOpen?.(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${authUrl}/logout`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/auth");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("logout error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[2000] flex h-dvh w-64 flex-col justify-between overflow-y-auto border-r border-gray-700 bg-[#161B22] p-4 transition-[transform,visibility] duration-300 ease-in-out md:static md:w-16 md:shrink-0 md:translate-x-0 md:p-2 md:visible lg:w-60 lg:p-4 xl:w-64 ${
        isOpen ? "translate-x-0" : "-translate-x-full invisible"
      }`}
    >
      <div className="w-full">
        {/* Logo row (+ close button on phones) */}
        <div className="flex items-center justify-between md:justify-center lg:justify-between">
          <div onClick={()=>setActive("BookRide")} className="cursor-pointer" aria-label="SafeGo home" onClick={close}>
            <img
              src="/logo.png"
              alt="SafeGo"
              onClick={()=>setActive("BookRide")}
              className="h-14 w-auto max-w-[9.5rem] object-contain md:hidden lg:block"
            />
            {/* Tablet rail: compact badge instead of the wide logo */}
            <span className="hidden size-10 items-center justify-center rounded-xl bg-green-500 text-xl font-extrabold text-[#161B22] md:flex lg:hidden">
              S
            </span>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="rounded-lg p-2 text-2xl text-gray-300 hover:bg-white/10 md:hidden"
          >
            <IoClose />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-2 lg:mt-8 lg:gap-3">
          {navItems.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              title={label}
              aria-label={label}
              onClick={() => {
                setActive(key);
                close();
              }}
              className={`flex w-full cursor-pointer items-center gap-4 rounded-lg p-2.5 text-left text-base font-semibold transition-colors md:justify-center lg:justify-start lg:text-lg ${
                active === key
                  ? "bg-green-500/10 text-green-500"
                  : "text-amber-100 hover:bg-white/5"
              }`}
            >
              <Icon className="size-6 shrink-0" />
              <span className="md:hidden lg:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom section: logout + note */}
      <div className="mt-6 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          title="Logout"
          aria-label="Logout"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-500 p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-60 lg:justify-start"
        >
          <MdLogout className={`size-6 shrink-0 ${loading ? "animate-pulse" : ""}`} />
          <span className="md:hidden lg:inline">
            {loading ? "Logging out..." : "Logout"}
          </span>
        </button>

        <div className="flex items-center gap-2 px-1 pb-2 text-xs text-gray-500 md:hidden lg:flex">
          <FaShieldAlt className="size-3.5 shrink-0 text-green-600" />
          Ride safe • 24/7 support
        </div>
      </div>
    </aside>
  );
};

export default LeftSide;