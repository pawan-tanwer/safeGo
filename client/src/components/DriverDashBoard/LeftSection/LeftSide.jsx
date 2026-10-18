import React, { useContext } from "react";
import { MdDashboard } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";
import { BiDetail } from "react-icons/bi";
import { FaRegQuestionCircle } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { IoCarSportSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";

const LeftSide = ({ setActivePage, activePage, isOpen, setIsOpen }) => {
  const { carData } = useContext(StoreContext);

  // reusable button classes — note the lg: prefixes for responsive label/width
  const navBtn = (page) =>
    `flex cursor-pointer items-center gap-2 text-lg font-medium rounded-lg p-2
     justify-center lg:justify-start w-full
     ${
       activePage === page
         ? "text-emerald-100 bg-emerald-500"
         : "text-gray-400 hover:text-emerald-100 hover:bg-emerald-500/20"
     }`;

  // closes the drawer on mobile after selecting a page
  const handleClick = (page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* ---- Dark overlay behind drawer (mobile only) ---- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ---- Sidebar ---- */}
      <div
        className={`
          fixed md:static z-2000 h-screen
          flex flex-col justify-between
          bg-[#01101E] border-r border-gray-400
          p-4 md:p-2 lg:p-4
          w-64 md:w-16 lg:w-60 xl:w-64
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Top: logo + close btn */}
        <div className="flex items-center justify-between">
          <div>
            <img src="/logo.png" className="w-32 lg:w-44" alt="SafeGo logo" />
          </div>
          {/* Close button — mobile only */}
          <button
            className="md:hidden text-gray-400 text-2xl cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <IoClose />
          </button>
        </div>

        {/* Nav buttons */}
        <div className="flex flex-col items-center lg:items-start justify-start mt-10 gap-6 lg:gap-8 w-full flex-1 overflow-y-auto">
          <button className={navBtn("dashBoard")} onClick={() => handleClick("dashBoard")}>
            <MdDashboard className="size-6 shrink-0" />
            <span className="md:hidden lg:inline">DashBoard</span>
          </button>

          <button className={navBtn("earning")} onClick={() => handleClick("earning")}>
            <IoIosWallet className="size-6 shrink-0" />
            <span className="md:hidden lg:inline">Earning</span>
          </button>

          <button className={navBtn("vehicleDetails")} onClick={() => handleClick("vehicleDetails")}>
            <BiDetail className="size-6 shrink-0" />
            <span className="md:hidden lg:inline">Vehicle Details</span>
          </button>

          <button className={navBtn("support")} onClick={() => handleClick("support")}>
            <FaRegQuestionCircle className="size-6 shrink-0" />
            <span className="md:hidden lg:inline">Support</span>
          </button>

          <button className={navBtn("settings")} onClick={() => handleClick("settings")}>
            <IoSettings className="size-6 shrink-0" />
            <span className="md:hidden lg:inline">Settings</span>
          </button>
        </div>

        {/* Vehicle info card — pinned bottom */}
        <div className="flex items-center gap-2 rounded-2xl bg-green-500/10 p-2 mt-4">
          <IoCarSportSharp className="p-2 size-9 bg-gray-400 rounded-full shrink-0" />
          <div className="flex flex-col md:hidden lg:flex overflow-hidden">
            <p className="text-emerald-200 font-semibold">Vehicle Info</p>
            <p className="text-sm font-normal ">
              {carData?.vehicle?.make} {carData?.vehicle?.model}: {carData?.vehicle?.vehicleNumber}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSide;
