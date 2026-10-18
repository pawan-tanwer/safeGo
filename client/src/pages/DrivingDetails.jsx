import React from "react";
import Details from "../components/DrivingDetails/Details";

const DrivingDetails = () => {
  return (
    <div className="min-h-screen w-full bg-[#161B22]">
      <div className="text-amber-100 flex flex-col items-center justify-center gap-1 pt-10 px-4 text-center">
        <img src="/logo.png" className="h-20 w-44 mx-auto" alt="" />
        <h4 className="text-xl font-bold">Tell us about your driving</h4>
        <p className="text-sm text-gray-400">
          add your vehicle and license details to start with SafeGo
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-6 px-4 sm:px-6 py-8">
        <div className="hidden md:block md:w-[38%] shrink-0">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 h-full min-h-[640px] sticky top-8">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent z-10" />
            <img
              src="/drivingDetails.png"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        </div>

        <div className="w-full md:w-[62%]">
          <Details />
        </div>
      </div>
    </div>
  );
};

export default DrivingDetails;