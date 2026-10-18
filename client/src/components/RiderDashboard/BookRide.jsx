import React, { useContext, useEffect, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import LeftSide from "./Book_a_ride/LeftSide/LeftSide";
import RightSide from "./Book_a_ride/RightSide/RightSide";
import Footer from "./RightSideComponents/Footer";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";

const BookRide = ({driverData,driverLocation,phase,markNoDriver,startSearching,currentRideId,resetPhase,expiresAt}) => {
  const {
    pickupCoords,
    destinationCoords,
    vehicleType,
    rideUrl,
    rideData,
    setRideData,
    accessToken,
  } = useContext(StoreContext);

  const isTracking = ["accepted", "arrived", "ongoing"].includes(phase);

  const text={
    arrived : "Driver has arrived at pickup location,Share OTP",
    ongoing : "Ride is ongoing,Enjoy your ride",
    completed : "Ride has been completed,Please pay the fare",
    accepted : "Driver is on the way",
  }

  const [cancelling,setCancelling] = useState(false); 

  const handleCancel = async()=>{
    try{
      setCancelling(true);
      const res = await axios.post(`${rideUrl}/${currentRideId}/cancel`,
        {},
        {
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        }
      )
      resetPhase()
    }catch(error){
      toast.error(error.response?.data?.message || "Could not cancel the ride")
    }finally{
      setCancelling(false);
    }
  }

  useEffect(()=>{
    console.log("driverLocation:",driverLocation)
  },[driverLocation])

  const [loading, setLoading] = useState(false);

  const findRideHandle = async () => {
    setLoading(true);
    try {
      console.log("destination coords :",destinationCoords)
      const res = await axios.post(
        `${rideUrl}/request`,
        {
          pickupLocation: pickupCoords,
          dropLocation: destinationCoords,
          vehicleType: vehicleType,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("book ride page :",res.data)

      if(res.data.noDriver){
        markNoDriver();
      }else{
        startSearching(res.data.ride._id,res.data.expiresAt);
      }

      if (res.data.success) {
        setRideData(res?.data.ride);
      }
    } catch (error) {
      console.error("error :", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-w-0 flex-col gap-3 text-white">
      {/** upper section*/}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col items-start">
          <h2 className="text-xl font-bold sm:text-2xl">Book a Ride</h2>
          <p className="text-sm text-gray-400 sm:text-base">
            Safe,Fast & Affordable Rides
          </p>
        </div>
        <div className="relative shrink-0 p-3">
          <FaBell className="size-5" />
          <GoDotFill className="absolute top-0 left-0 text-green-500" />
        </div>
      </div>

      {/** Phone / tablet : form + map  →  FindRide button  →  promo card
          Desktop (xl+)  : 70 / 30 columns, FindRide button underneath both */}
      <div className="mt-1 grid grid-cols-1 gap-4 xl:mt-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] xl:gap-x-7 xl:gap-y-3">
        <div className="order-1 min-w-0 rounded-2xl border border-gray-700 xl:col-start-1 xl:row-start-1">
          <LeftSide
            driverLocation={driverLocation}
            phase={phase}
            expiresAt={expiresAt}
            onCancel={handleCancel}
            cancelling={cancelling}
            resetPhase={resetPhase}
            driverData={driverData}
          />
        </div>

        <div className="order-3 min-w-0 overflow-hidden rounded-2xl border border-gray-700 xl:order-none xl:col-start-2 xl:row-start-1">
          <RightSide driverData={driverData} />
        </div>

        {/** FindRide Button*/}
        <div className="order-2 xl:order-none xl:col-span-2 xl:row-start-2">
          {isTracking ? (
            <p className="rounded-lg bg-green-500/20 p-3 text-center text-base font-medium text-green-500 sm:text-xl xl:text-2xl">
              {text[phase]}
            </p>
          ) : (
            <button
              type="button"
              className="min-h-12 w-full cursor-pointer rounded-lg bg-green-500/20 p-3 text-lg font-medium text-green-500 transition hover:bg-green-500/30 disabled:cursor-wait disabled:opacity-60 sm:text-xl xl:text-2xl"
              onClick={findRideHandle}
              disabled={loading}
            >
              {loading ? <span>searching....</span> : <span>FindRide</span>}
            </button>
          )}
        </div>
      </div>

      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default BookRide;
