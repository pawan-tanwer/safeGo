import { useState } from "react";
import { FaAddressCard } from "react-icons/fa";
import { Camera } from "lucide-react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { toast } from "react-toastify";

const LicenseDetails = ({ setStep, setLicenseImage, setLicenseNumber }) => {
  const [number, setNumber] = useState("");
  const [preview, setPreview] = useState(null);   // local preview URL only

  const onLicenseNumberChange = (e) => {
    const { value } = e.target;
    setNumber(value);
    setLicenseNumber(value);
  };

  const onImageSubmit = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // validate type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG or JPG files are allowed");
      return;
    }

    // validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setLicenseImage(file);              // actual File object → goes to parent for upload
    setPreview(URL.createObjectURL(file));   // local preview only, not sent anywhere
  };

  const handleNext = () => {
    if (!number.trim()) {
      toast.error("Please enter your license number");
      return;
    }
    if (!preview) {
      toast.error("Please upload your license photo");
      return;
    }
    setStep(2);
  };

  return (
    <div className="text-white flex flex-col gap-12 justify-self-center mt-4 w-lg">
      <div className="w-full rounded flex flex-col items-center gap-8 p-4 bg-green-500/10 transition-all duration-300 hover:shadow-[0_0_20px_2px_rgba(34,197,94,0.5)]">

        <p className="flex items-center gap-3">
          <FaAddressCard />
          <span className="text-lg font-medium">Driving License Information</span>
        </p>

        <div className="w-full flex flex-col items-start">
          <p className="font-normal">License Number</p>
          <input
            type="text"
            value={number}
            onChange={onLicenseNumberChange}
            name="licenseNumber"
            placeholder="Enter your license number"
            className="p-2 w-full border rounded"
          />
        </div>

        <label
          htmlFor="license-upload"
          className="flex flex-col items-center justify-center gap-2 w-full py-10 border-2 border-dashed border-gray-600 rounded-xl bg-black/20 cursor-pointer hover:border-green-500 transition-colors"
        >
          {preview ? (
            <img
              src={preview}
              alt="License preview"
              className="h-50 object-contain  rounded "
            />
          ) : (
            <>
              <Camera className="w-6 h-6 text-gray-300" />
              <span className="text-white text-sm font-medium">
                Upload License Photo
              </span>
              <span className="text-gray-500 text-xs">PNG or JPG, max 5MB</span>
            </>
          )}

          <input
            id="license-upload"
            type="file"
            name="licenseImage"
            accept=".png,.jpg,.jpeg"
            onChange={onImageSubmit}
            className="hidden"
          />
        </label>

        <div>
          <button
            type="button"
            className="flex items-center gap-2 bg-gray-500 cursor-pointer p-2 rounded"
            onClick={handleNext}
          >
            Next: Vehicle Details <MdOutlineArrowRightAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseDetails;