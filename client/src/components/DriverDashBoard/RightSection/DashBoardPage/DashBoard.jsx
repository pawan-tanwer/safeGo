import React from "react";
import Top from "./Component/Top";
import Mid from "./Component/Mid";
import Bottom from "./Component/Bottom";

const DashBoard = ({
  rideRiderData,
  setRideRiderData,
  setIsOnline,
  isOnline,
  driverCoordinates,
}) => {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col pb-6">
      <Top setIsOnline={setIsOnline} isOnline={isOnline} />
      <Mid
        driverCoordinates={driverCoordinates}
        riderData={rideRiderData}
        setRiderData={setRideRiderData}
      />
      <Bottom />
    </div>
  );
};

export default DashBoard;