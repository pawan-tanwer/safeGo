import React from "react";

const Searching = () => {
  return (
    <div className="flex flex-col w-full h-full p-4 gap-7">
      <h3 className="text-2xl font-bold">Ride Details :</h3>
      <div className="flex flex-col gap-3 items-start justify-center">
        <div>
          <p className="text-gray-400">Pickup Address :</p>
          <p className="text-gray-200">Green Park, delhi</p>
        </div>
        <div>
            <p className="text-gray-400">Where to:</p>
            <p className="text-gray-200">Cyber Hub, Gurugram</p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center text-gray-400 border-t-2">
        <img src="/auto.png" className="size-10" alt="" />
        <p>Distance : <span className="text-gray-100">18km</span></p>
        <p>Time : <span className="text-gray-100">32min</span></p>
        <p>Estimate Fare : <span className="text-gray-100">$ 23</span></p>
        <p>Drivers nearby are being notified</p>
      </div>
    </div>
  );
};

export default Searching;
