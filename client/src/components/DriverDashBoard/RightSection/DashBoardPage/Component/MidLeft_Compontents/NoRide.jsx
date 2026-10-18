import { AiOutlineSafety } from "react-icons/ai";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { MdSupportAgent } from "react-icons/md";

const tips = [
  {
    Icon: AiOutlineSafety,
    title: "Stay Safe",
    text: "Follow traffic rules and verify rider OTP",
  },
  {
    Icon: BsFillLightningChargeFill,
    title: "Peak Hours",
    text: "Earn more during rush hours",
  },
  {
    Icon: CiLocationOn,
    title: "Stay in High-Demand Zones",
    text: "Position yourself near busy areas",
  },
  {
    Icon: MdSupportAgent,
    title: "24/7 Support",
    text: "We're here if you need help",
  },
];

const NoRide = () => {
  return (
    <section className="w-full rounded-2xl border border-gray-600/60 bg-white/[0.03] p-4 sm:p-5">
      <h4 className="text-base font-semibold sm:text-lg">
        Quick Tips <span className="text-gray-400">· Getting Started</span>
      </h4>

      {/* 1 column on phones & desktop side panel, 2 columns on tablets */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1">
        {tips.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 sm:gap-4">
            <Icon className="size-10 shrink-0 rounded-full bg-green-500/15 p-2 text-green-400 ring-1 ring-green-500/30 sm:size-12" />
            <div className="min-w-0">
              <p className="text-sm font-medium sm:text-base">{title}</p>
              <p className="text-xs text-gray-400 sm:text-sm">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NoRide;