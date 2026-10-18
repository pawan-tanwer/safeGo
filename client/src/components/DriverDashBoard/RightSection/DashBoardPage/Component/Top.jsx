import React, { useContext, useState } from "react";
import { FaCar, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../../../../context/StoreContext";

const Top = ({ setIsOnline, isOnline }) => {
  const { driverUrl, accessToken, userData } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);

  // Online/Offline toggle – tells the backend
  const updateOnlineStatus = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${driverUrl}/online-status`,
        { isOnline: !isOnline },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        if(response.data.isOnline == true){
          toast.success(response?.data?.message);
        }
        setIsOnline(response.data.isOnline);
      }
    } catch (error) {
      console.error("failed to update online status:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="flex w-full items-center justify-between gap-3 border-b border-gray-700/60 pb-3 sm:pb-4">
      {/* Greeting */}
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold sm:text-xl lg:text-2xl">
          Dear{" "}
          <span className="text-green-500">
            {userData?.name?.toUpperCase()}
          </span>
        </h2>
        <p className="truncate text-xs text-gray-400 sm:text-sm">
          Ready to start earning?
        </p>
      </div>

      {/* Online / Offline toggle */}
      <button
        type="button"
        onClick={updateOnlineStatus}
        disabled={loading}
        aria-pressed={isOnline}
        aria-label={isOnline ? "Go offline" : "Go online"}
        className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-xs font-semibold tracking-wide transition active:scale-95 disabled:cursor-wait disabled:opacity-70 sm:gap-3 sm:py-2 sm:pl-2 sm:pr-5 sm:text-sm ${
          isOnline
            ? "border-green-500/40 bg-green-500/15 text-green-400"
            : "border-gray-600/50 bg-gray-500/15 text-gray-400"
        }`}
      >
        <span
          className={`flex size-8 items-center justify-center rounded-full bg-white sm:size-10 ${
            isOnline ? "text-green-600" : "text-gray-500"
          }`}
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaCar className="text-sm sm:text-base" />
          )}
        </span>

        {isOnline && (
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
        )}

        <span>{isOnline ? "ONLINE" : "OFFLINE"}</span>
      </button>
    </header>
  );
};

export default Top;