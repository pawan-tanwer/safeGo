import { useEffect,useState,useRef } from "react";
import { getSocket } from "../Socket/Socket";

export function useDriverLocation(isOnline){
    const [position, setPosition] = useState(null); //{latitude: null, longitude: null}
    const lastPos = useRef(null)
    console.log("[hook] called, isOnline =", isOnline);
  // watchPosition ke success callback ke andar:
  // setInterval ke andar:
  console.log("[hook] emitting", lastPos.current);

    useEffect(()=>{
        if(!isOnline){
            setPosition(null);
            lastPos.current = null;
            return;
        }

        const id =  navigator.geolocation.watchPosition(
            (pos)=>{
                console.log(pos)
                const {latitude,longitude} = pos.coords;
                lastPos.current = {latitude,longitude};
                setPosition({lat:latitude,lng:longitude});
            },
            (err)=>console.error("GPS error:",err),
            {enableHighAccuracy:true,maximumAge:2000,timeout:10000}
        );
        return ()=>{
            navigator.geolocation.clearWatch(id);
        }
    },[isOnline])

    useEffect(()=>{
        if(!isOnline) return;
        const socket = getSocket();
        const timer = setInterval(()=>{
            if(lastPos.current) socket.emit("driver:updateLocation",lastPos.current)
        },3000);
    return ()=> clearInterval(timer)
    },[isOnline])

    return {position};
}