import React, { useState } from 'react'
import{ useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import axios from "axios";

const Login = ({setShowOtp,setOtpEmail}) => {

  const {authType, setAuthType,setAccessToken, setUserData , role,authUrl,setAuthentication} = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading ,setLoading] = useState(false);
  const [data,setData] = useState({
    identifier:"",
    password:""
  })

  const changeHandle = (e)=>{
    const {name,value} = e.target;
    setData((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const submitHandle = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${authUrl}/login`,
        {
          identifier:data.identifier,
          password:data.password
        },
        {
          withCredentials:true
        }
      )

      if(response.data?.success){
        setAccessToken(response.data?.accessToken);
        setUserData(response.data.user);
        toast.success(response.data?.message);
        setAuthentication(true);
        if(role == "rider"){
          navigate("/rider-dashboard");
        }else{
          navigate("/driver-dashboard");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error("login error :", error);
    }finally{
      setLoading(false);
    }
  }

   const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${authUrl}/google`, {
        credential: credentialResponse.credential,
        role
      },
      {
        withCredentials:true
      }
    );
  
      if (res.data?.success) {
        setAccessToken(res.data.accessToken);
        setUserData(res.data.user);
        toast.success(res.data.message);
        if(role == "rider"){
          navigate("/rider-dashboard");
        }else{
          navigate("/driver-dashboard");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    }
  };

  const handleForgotPassword = async(e)=>{
    e.preventDefault();
    try {
      const response = await axios.post(`${authUrl}/forgot-password-otp`,
        {email:data?.identifier},
        {
          withCredentials:true
        }
      )
      if(response.data?.success){
        toast.success(response.data?.message);
        setShowOtp(true);
        setOtpEmail(data?.identifier);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error(error)
    }
  }

  return (
    <div className='p-7 w-full h-full mt-9 border-white/20 rounded mr-4 transition-all duration-300 hover:shadow-[0_0_20px_2px_rgba(34,197,94,0.5)]'>
      <div className='flex gap-50 text-gray-400 text-sm justify-center items-center border-b-2'>
        <h2 onClick={()=> setAuthType("login")} className={`font-bold cursor-pointer text-2xl p-2  ${authType === "login" ? "text-green-400" : "text-amber-50 "}`}>Login</h2>
        <h2 onClick={()=> setAuthType("register")} className={`font-bold cursor-pointer text-2xl p-2 ${authType === "register" ? "text-green-400" : "text-amber-50 "}`}>Register</h2>
      </div>
      <div className='flex flex-col items-start mt-4'>
        <h2 className='text-2xl font-bold text-amber-50'>Welcome back!</h2>
        <p className='text-gray-400 text-sm'>login to continue your journey</p>
      </div>
      <div className='flex flex-col items-start gap-4 mt-5 w-full px-3'>
        <input type='text' name='identifier' value={data.identifier} onChange={changeHandle} className='bg-[#161B22] rounded text-gray-400 w-full placeholder:text-gray-500 border px-7 py-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Email or Phone'/>
        <input type="text" name='password' value={data.password} onChange={changeHandle} className='bg-[#161B22] rounded text-gray-400 w-full placeholder:text-gray-500 border px-7 py-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Password'/>
      </div>
      <p className='flex justify-self-end text-green-500 pt-2 cursor-pointer' onClick={handleForgotPassword} >Forgot Password?</p>
      <button type='button' onClick={submitHandle} className='w-full text-center mt-10 cursor-pointer text-white font-medium p-2 rounded bg-[#00C853]'>
        {
          loading?<p>loading...</p>
          :<p>Login</p>
        }
      </button>
      <div className='flex items-center justify-center gap-1 text-gray-50 mt-5'>
        <div className='border-1 w-[40%]'></div>
        <div>or continue with</div>
        <div className='border-1 w-[40%]'></div>
      </div>
     <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google login failed")}
     />
      <p className='text-gray-400 text-sm mt-5 text-center'>Safe with <span className='text-green-500 cursor-pointer'>SafeGo</span></p>
    </div>
  )
}

export default Login
