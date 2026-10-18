import { useState, useRef, useEffect } from "react";
import { Mail, X, Info } from "lucide-react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate,} from "react-router-dom";
import {toast} from "react-toastify"
import axios from "axios";

export default function VerifyEmail({
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [secondsLeft, setSecondsLeft] = useState(45);

  const {setEmailVerify,authUrl,setAccessToken,setUserData,email,role,setAuthentication} = useContext(StoreContext);
  const navigate= useNavigate()
  const [loading,setLoading] = useState(false);

  const handleVerify = async(e)=>{
    e.preventDefault();
    if(loading) return;
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    try {
        const response = await axios.post(`${authUrl}/verify-email`,
            {
                otp:code,
                email:email
            },
            {
                withCredentials:true,
            }
        )
        if(response?.data?.success){
            setAccessToken(response.data?.accessToken)
            toast.success(response.data?.message);
            setUserData(response.data?.user)
            setAuthentication(true);
            setEmailVerify(false);
            if(role == "rider"){
          navigate("/rider-dashboard");
        }else{
          navigate("/driver-auth");
        } 
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Something Wrong")
    }finally{
        setLoading(false);
    }

  }

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleChange(index, value) {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    pasted.split("").forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);

    const nextEmptyIndex = pasted.length < 6 ? pasted.length : 5;
    inputRefs.current[nextEmptyIndex]?.focus();
  }

  function handleResendClick() {
    if (secondsLeft > 0) return; // safety guard, button waise bhi disabled hoga
    
    setSecondsLeft(45); // timer restart
    setOtp(["", "", "", "", "", ""]); // purana OTP clear karo
    inputRefs.current[0]?.focus();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="relative bg-[#0a1210] border border-[#1f2f2a] rounded-2xl p-8 w-full max-w-sm">
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5 cursor-pointer" onClick={()=>setEmailVerify(false)}/>
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center">
              <Mail className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        <h2 className="text-white text-2xl font-bold text-center mb-2">
          Check Your Email
        </h2>
        <p className="text-gray-400 text-sm text-center">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-emerald-400 text-sm font-medium text-center mb-1">
          {email || "fmf"}
        </p>    
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter the code below to verify your email address.
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-white text-lg font-semibold bg-transparent border border-[#2a3a34] rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-full transition-colors"
        >
          {
            loading?
            <p>Verifying....</p>
            :<p>Verify Email</p>
          }
        </button>

        {/* Resend section — timer ya button, jo bhi applicable ho */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Didn't receive the code?{" "}
          {secondsLeft > 0 ? (
            <span className="text-gray-500">
              Resend in {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </span>
          ) : (
            <button
              onClick={handleResendClick}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Resend Code
            </button>
          )}
        </p>

        <div className="flex items-center gap-2 mt-5 px-3 py-2.5 border border-[#1f2f2a] rounded-lg">
          <Info className="w-4 h-4 text-gray-400 shrink-0" />
          <p className="text-gray-400 text-xs">
            The code will expire in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}