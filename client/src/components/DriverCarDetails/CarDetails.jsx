import { useState } from "react";
import { FaCar } from "react-icons/fa";
import { LuBike } from "react-icons/lu";
import { MdElectricRickshaw } from "react-icons/md";


// Brand + model data per vehicle type
const vehicleData = {
  car: {
    "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "WagonR", "Ertiga"],
    Hyundai: ["i20", "Creta", "Venue", "Verna", "Grand i10"],
    Tata: ["Nexon", "Tiago", "Punch", "Altroz", "Tigor"],
    Honda: ["City", "Amaze", "WR-V"],
    Toyota: ["Innova", "Glanza", "Fortuner"],
  },
  bike: {
    Hero: ["Splendor", "Passion", "HF Deluxe", "Glamour"],
    Honda: ["Shine", "Unicorn", "SP125", "Activa"],
    Bajaj: ["Pulsar", "Platina", "CT100", "Avenger"],
    TVS: ["Apache", "Jupiter", "Ntorq"],
    Yamaha: ["FZ", "R15", "MT15"],
  },
  auto: {
    Bajaj: ["RE Compact", "Maxima", "Qute"],
    Piaggio: ["Ape City", "Ape Xtra"],
    Mahindra: ["Treo", "Alfa"],
    TVS: ["King Duramax"],
  },
};

const CarDetails = ({ setVehicle,setStep }) => {
  // local UI state — drives which dropdown options are shown
  const [vehicleType, setVehicleType] = useState("car");
  const [selectedBrand, setSelectedBrand] = useState("");

  //handlers update BOTH local UI state AND the shared `vehicle` object ----

  const handleTypeChange = (type) => {
    setVehicleType(type);
    setSelectedBrand("");

    setVehicle((prev) => ({
      ...prev,
      vehicleType: type,
      make: "",
      model: "",
    }));
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);

    setVehicle((prev) => ({
      ...prev,
      make: brand,
      model: "",   // reset model when brand changes
    }));
  };

  const handleModelChange = (model) => {
    setVehicle((prev) => ({
      ...prev,
      model,
    }));
  };

  const handleColorChange = (e) => {
    setVehicle((prev) => ({
      ...prev,
      color: e.target.value,
    }));
  };

  const handleNumberChange = (e) => {
    setVehicle((prev) => ({
      ...prev,
      vehicleNumber: e.target.value.toUpperCase(),
    }));
  };

  const brands = Object.keys(vehicleData[vehicleType] || {});
  const models = selectedBrand ? vehicleData[vehicleType][selectedBrand] || [] : [];

  return (
    <div className=" w-lg rounded flex flex-col gap-8 p-4 justify-self-center bg-green-500/10 transition-all duration-300 hover:shadow-[0_0_20px_2px_rgba(34,197,94,0.15)]">
      <div className="flex items-center gap-1 text-2xl font-medium">
        <FaCar /> Vehicle Information
      </div>

      {/* Vehicle Type */}
      <div className="flex flex-col items-start w-full gap-2">
        <p>Vehicle Type</p>
        <div className="flex justify-around items-center w-full">
          <p
            onClick={() => handleTypeChange("car")}
            className={`flex items-center gap-2 rounded p-2 cursor-pointer transition-colors ${
              vehicleType === "car" ? "bg-green-600 text-white" : "bg-gray-500"
            }`}
          >
            <FaCar className="size-5" /> Car
          </p>
          <p
            onClick={() => handleTypeChange("bike")}
            className={`flex items-center gap-2 rounded p-2 cursor-pointer transition-colors ${
              vehicleType === "bike" ? "bg-green-600 text-white" : "bg-gray-500"
            }`}
          >
            <LuBike className="size-5" /> Bike
          </p>
          <p
            onClick={() => handleTypeChange("auto")}
            className={`flex items-center gap-2 rounded p-2 cursor-pointer transition-colors ${
              vehicleType === "auto" ? "bg-green-600 text-white" : "bg-gray-500"
            }`}
          >
            <MdElectricRickshaw className="size-5" /> Auto
          </p>
        </div>
      </div>

      {/* Brand + Model */}
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-2 w-1/2">
          <p>Vehicle Brand</p>
          <select
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="bg-black/20 border border-gray-600 rounded p-2 text-sm outline-none focus:border-green-500"
          >
            <option value="" className="bg-black text-white">Select brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand} className="bg-black text-white">
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <p>Vehicle Model</p>
          <select
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={!selectedBrand}
            className="bg-black/20 border border-gray-600 rounded p-2 text-sm outline-none focus:border-green-500 disabled:opacity-50"
          >
            <option value="" className="bg-black text-white">
              {selectedBrand ? "Select model" : "Select brand first"}
            </option>
            {models.map((model) => (
              <option key={model} value={model} className="bg-black text-white">
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Color + Number */}
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-2 w-1/2">
          <p>Vehicle Color</p>
          <input
            type="text"
            placeholder="e.g. White"
            onChange={handleColorChange}
            className="bg-black/20 border border-gray-600 rounded p-2 text-sm outline-none focus:border-green-500 placeholder:text-gray-500"
          />
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <p>Vehicle Number</p>
          <input
            type="text"
            placeholder="e.g. DL 5S AB 1234"
            onChange={handleNumberChange}
            maxLength={13}
            className="bg-black/20 border border-gray-600 rounded p-2 text-sm outline-none focus:border-green-500 placeholder:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default CarDetails;