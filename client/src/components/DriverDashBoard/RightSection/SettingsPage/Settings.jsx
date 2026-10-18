import { useContext, useState } from "react";
import { StoreContext } from "../../../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const inputCls =
  "w-full rounded-lg bg-[#0f1a17] border border-gray-700 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60";

const ToggleRow = ({ label, hint }) => (
  <label className="flex cursor-pointer items-center justify-between py-3">
    <div>
      <p>{label}</p>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
    <span className="relative inline-block h-6 w-11">
      <input type="checkbox" className="peer sr-only" />
      <span className="absolute inset-0 rounded-full bg-gray-600 transition peer-checked:bg-emerald-600" />
      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
    </span>
  </label>
);

const DocRow = ({ name, status }) => (
  <div className="flex items-center justify-between py-3">
    <span>{name}</span>
    <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-xs text-emerald-400">
      {status}
    </span>
  </div>
);

export default function Settings() {
  const {authUrl,accessToken} = useContext(StoreContext);
  const [data,setData] = useState({
    name:"",
    oldPassword:"",
    newPassword:"",
    phone:""
  });
  const navigate = useNavigate();
  const onChangeHandler = (e)=>{
    const {value,name} = e.target;
    setData((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    try {
      const response = await axios.post(`${authUrl}/update`,
        { 
          name:data?.name,
          oldPassword:data?.oldPassword,
          nedwPassword:data?.newPassword,
          phone:data?.phone
        },
        {
          headers:{
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      if(response.data?.success){
        toast.success(response?.data?.message);
        setData({
          name:"",
          oldPassword:"",
          newPassword:"",
          phone:""
        })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }
    const handleLogout = async()=>{
        try {
            const response = await axios.get(`${authUrl}/logout`,
                {
                    headers:{
                        Authorization: `Bearer ${accessToken}`
                    },
                    withCredentials:true
                } 
            )

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/auth");
            }
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error("logout error",error)
        }
    }  

  return (
    <div className="mx-auto max-w-3xl space-y-8 text-white">
      <h1 className="text-2xl font-bold">Settings</h1>

      <form onSubmit={onSubmitHandler} className="space-y-3 rounded-xl border border-gray-700 p-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <input placeholder="Full name" name="name" value={data.name} onChange={onChangeHandler} className={inputCls} />
        <div>
          <input inputMode="numeric" placeholder="Phone number" value={data.phone} onChange={onChangeHandler} name="phone" className={inputCls} />
          <p className="mt-1 text-xs text-gray-500">
            Riders see this number. Changing it needs OTP verification.
          </p>    
        </div>
        <button type="submit" className="rounded-lg cursor-pointer bg-emerald-600 px-6 py-2 font-semibold">
          Save
        </button>
      </form>

      <section className="rounded-xl border border-gray-700 px-4 py-2">
        <h2 className="pt-2 text-lg font-semibold">Preferences</h2>
        <div className="divide-y divide-gray-700">
          <ToggleRow label="New ride request sound" />
          <ToggleRow label="Vibrate on new request" hint="Works on supported devices" />
        </div>
      </section>

      <section className="rounded-xl border border-gray-700 px-4 py-2">
        <h2 className="pt-2 text-lg font-semibold">Documents</h2>
        <div className="divide-y divide-gray-700">
          <DocRow name="Driving licence" status="Approved" />
          <DocRow name="Vehicle RC" status="Approved" />
        </div>
        <p className="py-3 text-xs text-gray-500">
          To update a document, go to Vehicle Details.
        </p>
      </section>

      <form onSubmit={onSubmitHandler} className="space-y-3 rounded-xl border border-gray-700 p-4">
        <h2 className="text-lg font-semibold">Change password</h2>
        <input
          type="password"
          placeholder="Current password"
          autoComplete="current-password"
          name="oldPassword"
          value={data?.oldPassword}
          onChange={onChangeHandler}
          className={inputCls}
        />
        <input
          type="password"
          placeholder="New password"
          autoComplete="new-password"
          name="newPassword"
          value={data?.newPassword}
          onChange={onChangeHandler}
          className={inputCls}
        />
        <button type="submit" className="rounded-lg cursor-pointer bg-emerald-600 px-6 py-2 font-semibold">
          Update password
        </button>
      </form>

      <button onClick={()=>handleLogout()} className="w-full cursor-pointer rounded-lg border hover:border-0 hover:bg-red-500/10 hover:text-red-500 border-red-600 py-3 font-semibold text-red-400 hover:bg-">
        Logout
      </button>
    </div>
  );
}