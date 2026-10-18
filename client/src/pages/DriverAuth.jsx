import React, { useContext, useEffect, useState } from 'react'
import LicenseDetails from '../components/DriverCarDetails/LicenseDetails'
import CarDetails from '../components/DriverCarDetails/CarDetails';
import axios from "axios";
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify';
import { useNavigate,} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const DriverAuth = () => {
    const [step,setStep] = useState(1);
    const navigate = useNavigate();
    const {driverUrl,accessToken,setUserData,userData,setCarData} = useContext(StoreContext);
    const [licenseNumber,setLicenseNumber] = useState("");
    const [licenseImage,setLicenseImage] = useState(""); 
    const [loading,setLoading] = useState(false);
    const [vehicle ,setVehicle] = useState({
        make:"",
        model:"",
        color:"",
        vehicleNumber:"",
        vehicleType:"car"
    })

    const onSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append("licenseNumber",licenseNumber);
            formData.append("licenseImage",licenseImage);
            formData.append("vehicle",JSON.stringify(vehicle));

            const response =  await axios.post(`${driverUrl}/profile`,
                formData,
                {
                    headers:{
                        Authorization: `Bearer ${accessToken}`
                    },
                    withCredentials:true
                }
            )
            if(response.data.success){
                toast.success(response.data.message);
                setCarData(response.data.driverProfile);
                navigate("/driver-dashboard");
            }
        } catch (error) {
            console.error("Driver car detail Submit error",error);
            toast.error(error.response.data.message);
            setLoading(false);
        }finally{
            setLoading(false);
        }

    }

    useEffect(()=>{
        console.log("driver's data :", userData);
    },[userData]);
  return (
    <div className='relative bg-[#01101E] w-full min-h-screen  text-white flex flex-col items-center gap-3 text-center'>
        {
            step == 2?(
                <button className='absolute top-20 cursor-pointer z-20 left-4 flex items-center p-2 rounded-2xl text-black bg-white' onClick={() => setStep(1)}>
                          <FaArrowLeft /> Back
                      </button>
            )
            :("")
        }
        <div className='relative w-full flex justify-center items-center gap-2 p-5 bg-green-500/20'> 
        {
            step==2 ?(
                <p className='p-2 size-6 bg-green-400 text-gray-500 rounded-full flex items-center'>1</p>
            ):(
                <p className='p-2 size-6 bg-gray-400 text-gray-500 rounded-full flex items-center'>1</p>
            )
        }

            <p className='border border-gray-200 w-sm'></p>
            <p className='p-2 size-6 bg-gray-400 text-gray-500 rounded-full flex items-center'>2</p>
            <img src="/logo.png" className='absolute w-42 left-2' alt="" />
        </div>
        <div className="flex flex-col items-center">
        <h2 className="text-2xl font-medium">Complete Your Driver Profile</h2>
        <p className="text-sm text-gray-400">
          We need few details to get you on the road
        </p>
      </div>
        <div>
            {
                step == 1 
                ? <LicenseDetails setStep={setStep} setLicenseImage={setLicenseImage} setLicenseNumber={setLicenseNumber}/>
                :<CarDetails setStep={setStep} setVehicle={setVehicle}/>
            }
        </div>
        {
            step==2 ?(
                    loading ? (
                        <p className='w-lg text-center p-2 mt-4 bg-green-700/10 rounded cursor-pointer font-medium text-green-500 hover:border hover:border-green-500 '>Loading....</p>
                    ):(
                        <button type='button' className='w-lg text-center p-2 mt-4 bg-green-700/10 rounded cursor-pointer font-medium text-green-500 hover:border hover:border-green-500 ' onClick={onSubmit}>Submit</button>
                    )
            ):(
                <div></div>
            )
        }
    </div>
  )
}

export default DriverAuth