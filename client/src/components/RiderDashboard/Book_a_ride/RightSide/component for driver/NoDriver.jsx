import { FaShieldVirus } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import { MdPercent } from "react-icons/md";
import { IoHeadsetOutline } from "react-icons/io5";

const features = [
  {
    Icon: FaShieldVirus,
    title: "Safe & Secure",
    text: "Your safety is our priority",
  },
  {
    Icon: FaBoltLightning,
    title: "Fast & Reliable",
    text: "Quick pickups, less waiting",
  },
  {
    Icon: MdPercent,
    title: "Affordable Rides",
    text: "Best prices,always",
  },
  {
    Icon: IoHeadsetOutline,
    title: "24/7",
    text: "We're here for you anytime",
  },
];

const fade = "radial-gradient(ellipse at center, black 20%, transparent 100%)";

const NoDriver = () => {
  return (
    <div className="w-full">
      {/* Image: capped height on phones/tablets (full-width here), natural size in the desktop side column */}
      <div className="p-3 sm:p-4">
        <img
          src="/rider/bookRide/carImage.png"
          alt=""
          className="mx-auto h-auto max-h-48 w-full rounded-2xl object-contain sm:max-h-64 xl:max-h-none"
          style={{ maskImage: fade, WebkitMaskImage: fade }}
        />
      </div>

      <div className="flex flex-col gap-4 p-3 pt-0 sm:p-4 sm:pt-0 xl:gap-8">
        <h2 className="text-xl font-medium sm:text-2xl">Why Choose SafeGo</h2>

        {/* 1 column on phones, 2 on tablets, back to 1 in the narrow desktop column */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 xl:grid-cols-1 xl:gap-6">
          {features.map(({ Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 sm:gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-green-300 text-green-500">
                <Icon className="size-5 sm:size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg">{title}</p>
                <p className="text-sm text-gray-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoDriver;