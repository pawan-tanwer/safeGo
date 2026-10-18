import React, { useEffect } from "react";
import NoDriver from "./component for driver/NoDriver";
import Driver from "./component for driver/Driver";

const RightSide = ({ driverData }) => {
  useEffect(() => {
    if (driverData == null) {
      console.log("driver data false");
    } else {
      console.log(" driver data true");
    }
  }, [driverData]);

  return (
    <div className="w-full min-w-0">
      {driverData ? <Driver driverData={driverData} /> : <NoDriver />}
    </div>
  );
};

export default RightSide;