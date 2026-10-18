import React from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import { IoArrowBackSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import VerifyEmail from "../components/Auth/VerifyEmail";
import OtpVerify from "../components/Auth/OtpVerify";
import { useState } from "react";
import { useEffect } from "react";
import ForgotPassword from "../components/Auth/ForgotPassword";

const Auth = () => {
  const { authType, role, emailVerify, setEmailVerify } =
    useContext(StoreContext);
  const [showOtp, setShowOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  useEffect(()=>{
    console.log("showOtp :",showOtp);
  },[showOtp]);
  return (
    <div className=" relative min-h-screen w-full flex justify-center gap-10 bg-[#0D1117]">
      <div className="w-1/2 h-full flex justify-center items-center relative">
        <img
          src={role === "driver" ? "authDriverImage.png" : "authRiderImage.png"}
          className="object-cover insert-0 z-3"
          alt=""
        />
        {role === "driver" ? (
          <div />
        ) : (
          <div className="absolute left-14 bottom-0 z-10 text-white text-center flex flex-col items-start ">
            <h3 className="text-2xl font-bold">Book rides in a few taps</h3>
            <p className="mt-3 text-gray-300">
              Choose your destination,find the best
            </p>
            <p className="text-gray-300">ride near you and travel safely</p>
          </div>
        )}
      </div>
      <div className="w-1/2 h-full mt-7 mr-8">
        {authType === "login" ? (
          <Login setShowOtp={setShowOtp} setOtpEmail={setOtpEmail} />
        ) : (
          <Register />
        )}
      </div>
      <NavLink
        to="/"
        className="absolute z-6 top-8  left-8 text-white hover:text-amber-500 cursor-pointer flex items-center gap-2"
      >
        <IoArrowBackSharp />
        back
      </NavLink>
      {emailVerify ? (
        <div className="absolute top-10 z-233 w-full bg-amber-600">
          <VerifyEmail />
        </div>
      ) : (
        ""
      )}
      {showOtp && (
        <OtpVerify
          email={otpEmail}
          onClose={() => setShowOtp(false)}
          setShowOtp={setShowOtp}
          setShowPassword={setShowPassword}
        />
      )}
      {showPassword && (
        <ForgotPassword
        email={otpEmail}
        setShowPassword={setShowPassword}
        />
      )
      }
    </div>
  );
};

export default Auth;
