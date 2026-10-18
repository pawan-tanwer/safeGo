import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { useEffect } from "react";


const Home = () => {
  const {setRole,role,authentication,authLoading} = useContext(StoreContext);
  const Navigate = useNavigate();
  useEffect(()=>{
    localStorage.setItem("role",role)
  },[role])

  useEffect(()=>{
    if(!authLoading && authentication){
      if(role == "rider"){
        Navigate("/rider-dashboard");
      }else{
        Navigate("/driver-dashboard");
      }
    }
  },[role,authentication,authLoading]);

  if(authLoading){
    return <div className="h-screen w-full flex items-center justify-center text-white">Loading...</div>
  }
  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background Image */}
      <img
        src="/homeBg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col z-10">
        
        {/* Logo */}
        <img
          className="h-20 w-44 m-2"
          src="/logo.png"
          alt=""
        />

        {/* Welcome Text - flex-1 se center mein aa jayega automatically */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 sm:gap-2.5 px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-medium text-white">
            Welcome to <span className="text-green-400">SafeGo</span>
          </h2>
          <h5 className="text-sm sm:text-md md:text-lg text-gray-400">
            Your safe journey, our priority
          </h5>
          <p className="text-gray-500 text-xs sm:text-sm">
            Choose how you want to get started
          </p>
        </div>

        {/* Cards Section */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-14 px-4 pb-8 sm:pb-12 md:pb-16">
          
          {/* Card 1 - I need a ride */}
          <NavLink to="/auth" onClick={()=> setRole("rider")}  className="w-full max-w-[240px] sm:w-56 md:w-60 bg-[#1A1F23] rounded-2xl flex flex-col p-3 sm:p-4 gap-4 sm:gap-6 items-center transition-all duration-300 hover:shadow-[0_0_20px_2px_rgba(34,197,94,0.5)] hover:-translate-y-1 cursor-pointer">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden">
              <img
                src="/ridelogo.png"
                alt=""
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col justify-start items-center gap-1">
              <h2 className="text-gray-200 text-base sm:text-lg md:text-2xl">
                I need a ride
              </h2>
              <p className="text-center px-2 sm:px-4 text-gray-400 text-xs sm:text-sm">
                Book a ride and reach your destination
              </p>
            </div>
          </NavLink>

          {/* Card 2 - I want to drive */}
          <NavLink to="/auth" onClick={()=> setRole("driver")} className="w-full max-w-[240px] sm:w-56 md:w-60 bg-[#1A1F23] rounded-2xl flex flex-col p-3 sm:p-4 gap-4 sm:gap-6 items-center transition-all duration-300 hover:shadow-[0_0_20px_2px_rgba(34,197,94,0.5)] hover:-translate-y-1 cursor-pointer">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden">
              <img
                src="/driverlogo.png"
                alt=""
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col justify-start items-center gap-1">
              <h2 className="text-gray-200 text-base sm:text-lg md:text-2xl">
                I want to drive
              </h2>
              <p className="text-center px-2 sm:px-4 text-gray-400 text-xs sm:text-sm">
                Earn by driving and helping others
              </p>
            </div>
          </NavLink>

        </div>
      </div>
    </div>
  );
};

export default Home;