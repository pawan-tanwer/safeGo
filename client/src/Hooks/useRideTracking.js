import { useEffect, useState } from "react";
import { getSocket } from "../Socket/Socket";

export function useRidetracking(rideId){
    const [driverLocation,setDriverLocation] = useState(null);

    useEffect(()=>{
        if(!rideId) return ;

        const socket = getSocket();
        const handler = (data) =>{
            if(String(data.rideId) === String(rideId)){
                console.log("Driver location update:", {lat:data.latitude,lng:data.longitude});
                setDriverLocation({lat:data.latitude,lng:data.longitude});
            }
        }

        socket.on("driver:locationUpdate",handler);
        return ()=>socket.off("driver:locationUpdate",handler);
    },[rideId]);

    return driverLocation
}