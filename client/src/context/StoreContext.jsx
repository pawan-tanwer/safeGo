import { createContext, useState } from "react";

export const StoreContext = createContext();

const storeContextProvider = (props) =>{

    const [role, setRole] = useState(()=>{
        return localStorage.getItem("role") ||"";
    });
    const[authType,setAuthType] = useState("login");
    const [active,setActive] = useState("Home");
    const [vehicleType, setVehicleType]=useState("car");
    const [map,setMap] = useState("nothing");
    const [pickupText,setPickupText] = useState("");
    const [destinationText,setDestinationText] = useState("");
    const [destinationCoords,setDestinationCoords] = useState(null);
    const [pickupCoords,setPickupCoords] = useState(null);
    const [routeCoords,setRouteCoords] = useState([]);
    const [routeInfo,setRouteInfo] = useState({distance:null,durationMin:null});

    const rideUrl   ="http://localhost:8000/api/ride";
    const authUrl   ="http://localhost:8000/api/auth";
    const driverUrl ="http://localhost:8000/api/driver"
    const [rideData,setRideData] = useState();
    const [carData,setCarData] = useState({})
    const [userData,setUserData] = useState();
    const [accessToken ,setAccessToken] = useState("");

    const [emailVerify,setEmailVerify] = useState(false); // verify email component ko show karne ke liye
    const [email,setEmail] = useState("");//regiration se email lekar VerifyEmail page me show karna
    const [authentication,setAuthentication] = useState(false);// the guys who didn't login , can't able to access the rider/driver dashboard
    const [authLoading, setAuthLoading] = useState(true);

    const contextValue = { 
        role, setRole, 
        authType, setAuthType,
        active, setActive,
        vehicleType,setVehicleType,
        map,setMap,
        pickupText,setPickupText,
        destinationText,setDestinationText,
        pickupCoords,setPickupCoords,
        destinationCoords,setDestinationCoords,
        routeCoords,setRouteCoords,
        routeInfo,setRouteInfo,
        accessToken,setAccessToken,
        rideData,setRideData,
        rideUrl,authUrl,
        userData,setUserData,
        emailVerify,setEmailVerify,
        email,setEmail,
        authentication,setAuthentication,
        authLoading,setAuthLoading,
        driverUrl,
        carData,setCarData
     };
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default storeContextProvider;