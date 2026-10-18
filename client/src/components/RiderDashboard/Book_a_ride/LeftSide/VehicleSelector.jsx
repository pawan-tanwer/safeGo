import { useRef } from "react";
import { LuBike } from "react-icons/lu";
import { FaCar } from "react-icons/fa";
import { MdElectricRickshaw } from "react-icons/md";

// `key` values must match what your backend / LeftSide already uses: "bike" | "car" | "auto"
const DEFAULT_OPTIONS = [
  { key: "bike", label: "Bike", Icon: LuBike, seats: 1 },
  { key: "car", label: "Car", Icon: FaCar, seats: 4 },
  { key: "auto", label: "Auto", Icon: MdElectricRickshaw, seats: 3 },
];

const VehicleSelector = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  fares,
  disabled = false,
  ridePrices,
}) => {
  const refs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (disabled) return;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (index + 1) % options.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (index - 1 + options.length) % options.length;
    }
    if (next === null) return;
    e.preventDefault();
    onChange(options[next].key);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Choose your ride type"
      className="grid grid-cols-3 gap-2 p-3 sm:gap-3 sm:p-4 xl:gap-4 xl:p-6"
    >
      {options.map(({ key, label, Icon, seats }, index) => {
        const selected = value === key;
        const fare = fares?.[key];
        const price = ridePrices?.[key];

        return (
          <button
            key={key}
            ref={(el) => (refs.current[index] = el)}
            type="button"
            role="radio"
            aria-checked={selected}
            // roving tabindex: only the selected option is in the tab order
            tabIndex={selected || (!value && index === 0) ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-3 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:py-4 ${
              selected
                ? "border-green-500 bg-green-600/60 text-white shadow-lg shadow-green-900/30"
                : "border-gray-600 bg-gray-500/40 text-gray-200 hover:border-gray-400 hover:bg-gray-500/60"
            }`}
          >
            <Icon className="size-8 sm:size-10" aria-hidden="true" />
            <span className="text-sm font-medium sm:text-base">{label}</span>

            {price != null && (
              <span className="text-base font-bold text-green-500 sm:text-lg">
                ₹{Math.round(price)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default VehicleSelector;
