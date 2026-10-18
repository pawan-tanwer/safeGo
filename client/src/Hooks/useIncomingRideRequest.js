import {useEffect ,useState} from 'react';
import { getSocket } from '../Socket/Socket';

export function useIncomingRideRequest (){
    const [incomingRide,setIncomingRide] = useState(null);

    useEffect(()=>{
            const socket = getSocket();

            const handleNewRequest = (data)=>{
                setIncomingRide(data);
            };

            const handleNoLongerAvailable = (data) =>{
                setIncomingRide((prev)=>
                    prev && prev.rideId === data.rideId ? null :prev
                );
            };

            socket.on("ride:newRequest",handleNewRequest);
            socket.on("ride:unavailable",handleNoLongerAvailable);

            return ()=>{
                socket.off("ride:newRequest",handleNewRequest);
                socket.off("ride:unavailable", handleNoLongerAvailable);
            }
    },[]);

    const clearRequest =()=>setIncomingRide(null);
    return {incomingRide,clearRequest}
}