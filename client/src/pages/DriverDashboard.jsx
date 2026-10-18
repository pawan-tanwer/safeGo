import React, { useContext, useEffect, useState } from "react";
import LeftSide from "../components/DriverDashBoard/LeftSection/LeftSide";
import DashBoard from "../components/DriverDashBoard/RightSection/DashBoardPage/DashBoard";
import { useIncomingRideRequest } from "../Hooks/useIncomingRideRequest";
import IncomingRideCard from "../components/Incoming Ride Request/IncomingRideCard";
import VehicleDetails from "../components/DriverDashBoard/RightSection/VehicleDetailPage/VehicleDetails";
import Support from "../components/DriverDashBoard/RightSection/SupportPage/Support";
import Settings from "../components/DriverDashBoard/RightSection/SettingsPage/Settings";
import { useDriverLocation } from "../Hooks/useDriverLocation";
import Earning from "../components/DriverDashBoard/RightSection/Earning";
import { GiHamburgerMenu } from "react-icons/gi";
import PhoneVerify from "./PhoneVerify";

const DriverDashboard = () => {
  const { incomingRide, clearRequest } = useIncomingRideRequest();
  const [rideRiderData, setRideRiderData] = useState(null);
  const [rideAccepted, setRideAccepted] = useState(false);
  const [activePage, setActivePage] = useState("dashBoard");
  const [isOnline, setIsOnline] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { position: driverCoordinates } = useDriverLocation(isOnline);

  // phone number verify
  const [phoneVerify,setPhoneVerify] = useState(true);

  const driverPages = {
    dashBoard: (<DashBoard
        rideRiderData={rideRiderData}
        setRideRiderData={setRideRiderData}
        setIsOnline={setIsOnline}
        isOnline={isOnline}
        driverCoordinates={driverCoordinates}
      />
    ),
    vehicleDetails: <VehicleDetails />,
    support: <Support />,
    settings: <Settings />,
    earning:<Earning/>
  };

  return (
    <div className="relative h-screen w-full text-white bg-[#01101E] flex overflow-hidden">
      {incomingRide && (
        <IncomingRideCard
          ride={incomingRide}
          onDone={clearRequest}
          setRideRiderData={setRideRiderData}
          setRideAccepted={setRideAccepted}
        />
      )}

      <LeftSide
        setActivePage={setActivePage}
        activePage={activePage}
        isOpen={isSidebarOpen}     
        setIsOpen={setIsSidebarOpen}  
      />

      {/* Right section — now flexible + scrollable */}
      <div className="flex-1 p-2 min-h-screen overflow-y-auto overflow-x-hidden">
        {/* 👈 Hamburger button — visible on mobile only */}
        <button
          className="md:hidden text-white text-2xl p-2 cursor-pointer"
          onClick={() => setIsSidebarOpen(true)}
        >
          <GiHamburgerMenu />
        </button>

        {driverPages[activePage]}
      </div>
  
    </div>
  );
};

export default DriverDashboard;
