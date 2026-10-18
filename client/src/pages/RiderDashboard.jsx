import React, { useContext, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import LeftSide from "../components/RiderDashboard/LeftSide";
import RightSide from "../components/RiderDashboard/RightSide";
import BookRide from "../components/RiderDashboard/BookRide";
import { StoreContext } from "../context/StoreContext";
import { useRidetracking } from "../Hooks/UseRideTracking";
import { useRiderNotified } from "../Hooks/useRiderNotified";
import Support from "../components/RiderDashboard/Support";
import Settings from "../components/RiderDashboard/Settings";

const RiderDashboard = () => {
  const { active } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false); // mobile drawer
  const {
    rideUpdate,
    phase,
    markNoDriver,
    startSearching,
    currentRideId,
    resetPhase,
    expiresAt,
  } = useRiderNotified();
  const driverLocation = useRidetracking(rideUpdate?.rideId);

  // Close the mobile drawer with the Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const navList = {
    Home: <RightSide />,
    BookRide: (
      <BookRide
        driverData={rideUpdate}
        driverLocation={driverLocation}
        phase={phase}
        markNoDriver={markNoDriver}
        startSearching={startSearching}
        currentRideId={currentRideId}
        resetPhase={resetPhase}
        expiresAt={expiresAt}
      />
    ),
    Support: <Support />,
    Settings: <Settings />,
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#161B22]">
      <LeftSide isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Backdrop behind the mobile drawer (above map layers, below the drawer) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1900] bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="h-full min-w-0 flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8">
        {/* Hamburger – phones only */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="mb-3 cursor-pointer rounded-lg p-2 text-2xl text-white hover:bg-white/10 md:hidden"
        >
          <GiHamburgerMenu />
        </button>

        {navList[active]}
      </main>
    </div>
  );
};

export default RiderDashboard;