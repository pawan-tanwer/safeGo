import "leaflet/dist/leaflet.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import DrivingDetails from "./pages/DrivingDetails";
import RiderDashboard from "./pages/RiderDashboard";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "./context/StoreContext";
import ProtectRiderDashBoard from "./utils/ProtectRiderDashBoard";
import DriverDashboard from "./pages/DriverDashboard";
import DriverAuth from "./pages/DriverAuth";
import { connectSocket } from "./Socket/Socket";
import ProtectDriverDashboard from "./utils/ProtectDriverDashboard";
import PhoneVerify from "./pages/PhoneVerify";

const App = () => {
  const {
    setAccessToken,
    authUrl,
    setUserData,
    authentication,authLoading,
    setAuthentication,
    setAuthLoading,
    accessToken,
    setCarData,
    driverUrl,
  } = useContext(StoreContext);
  useEffect(() => {
    const tryAuthLogin = async () => {
      console.log("refreshToken react")
      try {
        const response = await axios.post(
          `${authUrl}/refresh-access-token`,
          {},
          {
            withCredentials: true,
          },
        );
        if (response.data.success) {
          setAccessToken(response.data.accessToken);
          setUserData(response.data.user);
          setAuthentication(true);
        }
      } catch (error) {
        console.error("app.jsx error for refreshToken", error || "Something wrong");
        setAuthentication(false);
      } finally {
        setAuthLoading(false);
      }
    };
    tryAuthLogin();

    const interval = setInterval(
      () => {
        tryAuthLogin();
      },
      14 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getDriverProfile = async () => {
      if (authLoading || !authentication) return;
      try {
        const response = await axios.get(`${driverUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        if (response.data.success) {
          setCarData(response?.data?.driverProfile);
        }
      } catch (error) {
        console.error("app.jsx error for driverProfile", error);
      }
    };
    getDriverProfile();
  }, [authLoading, authentication,accessToken]);

  useEffect(()=>{
    if(!accessToken) return ;
      connectSocket(accessToken);
    },[accessToken])

  return (
    <div className="h-full w-full ">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/driving-details" element={<DrivingDetails />} />
        <Route path="/driver-auth" element={<DriverAuth/>}/>
        <Route element={<ProtectRiderDashBoard />}>
          <Route path="/rider-dashboard" element={<RiderDashboard />} />
        </Route>
        <Route element={<ProtectDriverDashboard />}>
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
        </Route>
        <Route path="/phone-verify" element={<PhoneVerify/>}/>
      </Routes>
    </div>
  );
};

export default App;
