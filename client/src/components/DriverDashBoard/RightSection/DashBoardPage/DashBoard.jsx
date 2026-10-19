import React from "react";
import Top from "./Component/Top";
import MId from "./Component/MId";
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
      <MId
        driverCoordinates={driverCoordinates}
        riderData={rideRiderData}
        setRiderData={setRideRiderData}
      />
      <Bottom />
    </div>
  );
};

export default DashBoard;