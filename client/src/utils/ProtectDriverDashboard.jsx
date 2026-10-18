import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProtectDriverDashboard = () => {
  const { authLoading, authentication, userData } = useContext(StoreContext);

  // 1. refresh API abhi chal rahi hai: kuch redirect/render mat karo
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#01101E] text-white">
        Loading...
      </div>
    );
  }

  // 2. login nahi hai
  if (!authentication) return <Navigate to="/auth" replace />;

  // 3. login hai par driver nahi hai
  if (userData?.role !== "driver") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectDriverDashboard;