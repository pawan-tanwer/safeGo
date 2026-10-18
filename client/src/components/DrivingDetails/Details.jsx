import React, { useState, useRef } from "react";
import { Car, Upload, CheckCircle2, ArrowRight } from "lucide-react";

// Vehicle Type ke hisaab se Make list, aur har Make ke hisaab se Model list
const VEHICLE_DATA = {
  car: {
    label: "Car",
    makes: {
      tata: { label: "Tata", models: ["Nexon", "Punch", "Tiago", "Altroz", "Tigor"] },
      honda: { label: "Honda", models: ["City", "Amaze", "Elevate"] },
      maruti: { label: "Maruti Suzuki", models: ["Swift", "Baleno", "Dzire", "WagonR", "Ertiga"] },
      hyundai: { label: "Hyundai", models: ["i20", "Creta", "Venue", "Verna", "Aura"] },
      mahindra: { label: "Mahindra", models: ["XUV700", "Scorpio", "Bolero", "XUV300"] },
      toyota: { label: "Toyota", models: ["Innova", "Glanza", "Urban Cruiser"] },
      kia: { label: "Kia", models: ["Seltos", "Sonet", "Carens"] },
    },
  },
  bike: {
    label: "Bike",
    makes: {
      hero: { label: "Hero", models: ["Splendor", "Passion", "HF Deluxe", "Glamour"] },
      honda: { label: "Honda", models: ["Shine", "Activa", "Unicorn", "SP125"] },
      bajaj: { label: "Bajaj", models: ["Pulsar", "Platina", "CT100", "Avenger"] },
      tvs: { label: "TVS", models: ["Apache", "Jupiter", "Sport", "Ntorq"] },
      royalEnfield: { label: "Royal Enfield", models: ["Classic 350", "Bullet", "Hunter 350"] },
      yamaha: { label: "Yamaha", models: ["FZ", "R15", "MT-15"] },
    },
  },
  auto: {
    label: "Auto",
    makes: {
      bajaj: { label: "Bajaj", models: ["RE Compact", "Maxima", "RE Auto"] },
      piaggio: { label: "Piaggio", models: ["Ape City", "Ape Xtra"] },
      mahindra: { label: "Mahindra", models: ["Alfa", "Treo"] },
      tvs: { label: "TVS", models: ["King Duramax", "King Deluxe"] },
    },
  },
};

const Details = () => {
  const [licenseImage, setLicenseImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  const handleFileSelect = (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG or PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    setLicenseImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  // Selected type ke hisaab se makes ki list nikalo
  const availableMakes = vehicleType ? VEHICLE_DATA[vehicleType].makes : {};

  // Selected make ke hisaab se models ki list nikalo
  const availableModels =
    vehicleType && vehicleMake
      ? VEHICLE_DATA[vehicleType].makes[vehicleMake]?.models || []
      : [];

  const handleTypeChange = (e) => {
    setVehicleType(e.target.value);
    setVehicleMake("");   // type badalne pe purana make/model reset karo
    setVehicleModel("");
  };

  const handleMakeChange = (e) => {
    setVehicleMake(e.target.value);
    setVehicleModel("");  // make badalne pe purana model reset karo
  };

  return (
    <div className="w-full bg-[#161B22] border border-white/10 rounded-2xl p-5 sm:p-7 flex flex-col gap-7">
      <div className="flex flex-col gap-2 items-start w-full">
        <label className="text-sm font-medium text-gray-300">
          Driving License Number
        </label>
        <input
          type="text"
          className="w-full bg-[#0D1117] text-gray-100 placeholder:text-gray-500 border border-gray-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          placeholder="Enter your driving license number"
        />
      </div>

      <div className="flex flex-col gap-2 items-start w-full">
        <label className="text-sm font-medium text-gray-300">
          Upload Driving License (Front Side)
        </label>

        <div
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`w-full rounded-xl border border-dashed px-6 py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            isDragging
              ? "border-emerald-500 bg-emerald-500/5"
              : "border-gray-700 bg-[#0D1117] hover:border-gray-500"
          }`}
        >
          {licenseImage ? (
            <>
              <CheckCircle2 className="text-emerald-500 size-6" />
              <p className="text-gray-200 text-sm truncate max-w-full">
                {licenseImage.name}
              </p>
              <span className="text-emerald-500 text-xs hover:underline">
                Click to change file
              </span>
            </>
          ) : (
            <>
              <Upload className="text-gray-400 size-6" />
              <p className="text-sm text-gray-300">
                Click to{" "}
                <span className="text-emerald-500 font-medium">upload</span>{" "}
                or drag and drop
              </p>
              <span className="text-xs text-gray-500">
                JPG, PNG or PDF (Max. 5MB)
              </span>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            name="licenseImage"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center gap-2">
          <Car className="text-emerald-500 size-5" />
          <h4 className="text-gray-200 font-semibold">Vehicle Information</h4>
        </div>

        {/* Vehicle Type sabse pehle -- isi se Make list decide hoti hai */}
        <select
          value={vehicleType}
          onChange={handleTypeChange}
          className="w-full bg-[#0D1117] text-gray-300 border border-gray-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none"
        >
          <option value="">Select Vehicle Type</option>
          {Object.entries(VEHICLE_DATA).map(([key, data]) => (
            <option key={key} value={key}>
              {data.label}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Vehicle Make -- jab tak Type select nahi hua, disabled rahega */}
          <select
            value={vehicleMake}
            onChange={handleMakeChange}
            disabled={!vehicleType}
            className="w-full bg-[#0D1117] text-gray-300 border border-gray-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {vehicleType ? "Vehicle Make" : "Select type first"}
            </option>
            {Object.entries(availableMakes).map(([key, make]) => (
              <option key={key} value={key}>
                {make.label}
              </option>
            ))}
          </select>

          {/* Vehicle Model -- jab tak Make select nahi hua, disabled rahega */}
          <select
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            disabled={!vehicleMake}
            className="w-full bg-[#0D1117] text-gray-300 border border-gray-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {vehicleMake ? "Vehicle Model" : "Select make first"}
            </option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>

          <select className="w-full bg-[#0D1117] text-gray-300 border border-gray-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none">
            <option value="">Vehicle Color</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="silver">Silver</option>
            <option value="grey">Grey</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="brown">Brown</option>
          </select>

          <div className="flex items-center gap-2 w-full bg-[#0D1117] border border-gray-700 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors">
            <span className="text-[10px] text-gray-500 border border-gray-600 rounded px-1 leading-tight">
              IND
            </span>
            <input
              type="text"
              placeholder="Vehicle Number"
              className="w-full bg-transparent text-gray-300 placeholder:text-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition-colors">
        Save &amp; Continue
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
};

export default Details;