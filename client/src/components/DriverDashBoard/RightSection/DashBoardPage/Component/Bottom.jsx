import { IoWalletSharp } from "react-icons/io5";
import { MdCreditScore } from "react-icons/md";
import { FaStar, FaWallet } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../../../../context/StoreContext";
import { toast } from "react-toastify";

const rupee = (n) =>
  n == null
    ? "--"
    : `${n < 0 ? "-" : ""}₹${Math.abs(Number(n)).toLocaleString("en-IN")}`;

const StatCard = ({
  label,
  value,
  Icon,
  iconClass = "text-green-400",
  valueClass = "text-white",
  hint,
}) => (
  <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-gray-600/60 bg-white/[0.03] p-3 transition hover:border-green-500/40 sm:p-4">
    <p className="truncate text-xs text-gray-400 sm:text-sm">{label}</p>
    <div className="flex items-center justify-between gap-2">
      <span
        className={`truncate text-xl font-semibold sm:text-2xl ${valueClass}`}
      >
        {value}
      </span>
      <Icon className={`shrink-0 text-xl sm:text-2xl ${iconClass}`} />
    </div>
    {hint && <p className="truncate text-xs text-gray-500">{hint}</p>}
  </div>
);

// props: todayEarning, ridesCompleted, walletBalance, rating (sab optional, null = "--")
const Bottom = ({
  todayEarning = null,
  ridesCompleted = null,
  walletBalance = null,
  rating = null,
}) => {
  const lowWallet = walletBalance != null && walletBalance < 0;

  const { driverUrl, accessToken } = useContext(StoreContext);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${driverUrl}/driver-rides`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        if (response.data?.success) {
          console.log(response.data?.success);
          setData(response.data?.driver);
        }
      } catch (error) {
        console.error("bottom.jsx error :", error);
      }
    };
    fetchData();
  }, [accessToken, data]);

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <StatCard
        label="Today's Earning"
        value={rupee(data?.totalEarning)}
        Icon={IoWalletSharp}
      />
      <StatCard
        label="Rides Completed"
        value={data?.ridesCompleted ?? "--"}
        Icon={MdCreditScore}
      />
      <StatCard
        label="Wallet balance"
        value={rupee(data?.walletBalance)}
        Icon={FaWallet}
        iconClass={lowWallet ? "text-red-400" : "text-green-400"}
        valueClass={lowWallet ? "text-red-400" : "text-white"}
        hint={lowWallet ? "Low balance, add money" : undefined}
      />
      <StatCard
        label="Rating"
        value={4}
        Icon={FaStar}
        iconClass="text-yellow-400"
      />
    </div>
  );
};

export default Bottom;
