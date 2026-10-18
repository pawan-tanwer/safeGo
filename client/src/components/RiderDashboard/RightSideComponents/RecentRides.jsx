import React from "react";
import { FaCar } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

const RecentRides = () => {
  return (
    <div className="w-full flex flex-col text-white mt-8">
      <div className=" w-full flex justify-between items-center">
        <p className="text-2xl font-medium">Recent Rides</p>
        <p className="text-green-400 cursor-pointer">View all</p>
      </div>
      <div>
        {/** */}
        <div className="flex  justify-between px-4 w-full m-2 border rounded-2xl bg-green-500/5 p-3">
          <div className="flex">
            <span className=" rounded-full p-3 w-10 h-10 bg-green-500/10 flex  self-center">
              <FaCar className="text-green-400" />
            </span>
            <div className="flex flex-col items-start justify-center">
              <p className="text-gray-400">Today, 07:32 PM</p>
              <p className="flex gap-3 items-center">
                Green Park <BsArrowRight /> Connaught Place
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <p>$400</p>
            <p className="text-gray-400">Cash</p>
          </div>
        </div>
        {/** */}
        <div className="flex  justify-between px-4 w-full m-2 border rounded-2xl bg-green-500/5 p-3">
          <div className="flex ">
            <span className=" rounded-full p-3 bg-green-500/10 flex  self-center">
              <FaCar className="text-green-400" />
            </span>
            <div className="flex flex-col items-start justify-center">
              <p className="text-gray-400">Today, 07:32 PM</p>
              <p className="flex gap-3 items-center">
                Green Park <BsArrowRight /> Connaught Place
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <p>$400</p>
            <p className="text-gray-400">Cash</p>
          </div>
        </div>
        {/** */}
        <div className="flex  justify-between px-4 w-full m-2 border rounded-2xl bg-green-500/5 p-3">
          <div className="flex ">
            <span className=" rounded-full p-3 bg-green-500/10 flex  self-center">
              <FaCar className="text-green-400" />
            </span>
            <div className="flex flex-col items-start justify-center">
              <p className="text-gray-400">Today, 07:32 PM</p>
              <p className="flex gap-3 items-center">
                Green Park <BsArrowRight /> Connaught Place
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <p>$400</p>
            <p className="text-gray-400">Cash</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentRides;
