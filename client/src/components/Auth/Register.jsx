import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {
    role,setAuthentication,
    authType,setAuthType,
    userData,setUserData,
    emailVerify,setEmailVerify,
    email,setEmail,
    authUrl,setAccessToken,
  } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    role,
    password: "",
    confirmPassword: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (registerData.password !== registerData.confirmPassword) {
        toast.error("confirmPassword do not match");
        return;
      }
      const response = await axios.post(
        `${authUrl}/register`,
        {
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          role: registerData.role,
          password: registerData.password,
        },
        {
          withCredentials: true,
        },
      );

      console.log(response);

      if (response.data.success) {
        setEmailVerify(true);
        toast.success(response.data?.message);
        setEmail(registerData.email);
        setRegisterData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something wrong");
      console.error("frontend register error :", error);
    } finally {
      setLoading(false);
    }
  };

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
      console.log("after after")
      setUserData(res.data.user);
      toast.success(res.data.message);
      if(role == "rider"){
          navigate("/rider-dashboard");
        }else{
          navigate("/driver-auth");
        }
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Google login failed");
  }
};

  return (
    <div className=" relative p-7 mt-9 rounded mr-4 transition-all duration-300 hover:shadow-[0_0_20px_2px_rgba(34,197,94,0.5)]">
      <div className="flex gap-50 text-gray-400 text-sm justify-center items-center border-b-2">
        <h2
          className={`font-bold cursor-pointer text-2xl p-2 ${authType === "login" ? "text-green-400" : "text-amber-50 "}`}
          onClick={() => setAuthType("login")}
        >
          Login
        </h2>
        <h2
          className={`font-bold cursor-pointer text-2xl p-2 ${authType === "register" ? "text-green-400" : "text-amber-50 "}`}
          onClick={() => setAuthType("register")}
        >
          Register
        </h2>
      </div>

      <h2 className="text-xl font-bold text-white mb-4 mt-5">
        Create your SafeGo account
      </h2>
      <form
        className="w-full flex flex-col gap-6"
        onSubmit={handleRegistration}
      >
        <input
          type="text"
          name="name"
          onChange={changeHandler}
          value={registerData.name}
          placeholder="Enter yourName"
          className="bg-[#161B22] rounded text-gray-400 w-full placeholder:text-gray-500 border px-7 py-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'"
        />
        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            onChange={changeHandler}
            value={registerData.email}
            placeholder="Enter your Email"
            className="bg-[#161B22] rounded text-gray-400 w-full placeholder:text-gray-500 border px-7 py-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'"
          />
          <input
            type="number"
            name="phone"
            onChange={changeHandler}
            value={registerData.phone}
            placeholder="Enter your Phone Number"
            className="bg-[#161B22] rounded text-gray-400 w-full placeholder:text-gray-500 border px-7 py-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'"
          />
        </div>
        <input
          type="text"
          name="role"
          value={role}
          readOnly
          className="bg-[#161B22] rounded text-gray-400 w-full placeholder:text-gray-500 border px-7 py-2 text-amber-800 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="password"
          onChange={changeHandler}
          value={registerData.password}
          placeholder="Enter your Password"
          className="bg-[#161B22] rounded text-gray-400 w-full placeholder:text-gray-500 border px-7 py-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'"
        />
        <input
          type="text"
          name="confirmPassword"
          onChange={changeHandler}
          value={registerData.confirmPassword}
          placeholder="Confirm your Password"
          className="bg-[#161B22] rounded text-gray-400 w-full placeholder:text-gray-500 border px-7 py-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'"
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded mt-4 w-full cursor-pointer"
        >
          {loading ? <p>loading....</p> : <p>Register</p>}
        </button>
      </form>
      <div className="flex items-center justify-center gap-1 text-gray-50 mt-5">
        <div className="border-1 w-[40%]"></div>
        <div>or continue with</div>
        <div className="border-1 w-[40%]"></div>
      </div>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google login failed")}
      />
      <p className="text-gray-400 text-sm mt-5 text-center">
        Safe with {" "}
        <span className="text-green-500 cursor-pointer">SafeGo</span>
      </p>
    </div>
  );
};

export default Register;
