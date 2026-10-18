import React, { useContext } from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'

const ProtectRiderDashBoard = () => {
    const {authentication,authLoading} = useContext(StoreContext);
    if (authLoading) {
    return <div className="h-screen w-full flex items-center justify-center text-white">Loading...</div>;
  }
  return authentication ? <Outlet/> : <Navigate to={"/"}/>;
}

export default ProtectRiderDashBoard