import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../../../../../context/StoreContext";
import { toast } from "react-toastify";
import OtpForm from "./OtpForm";
import { toLatLng } from "../../../../../../utils/toLatLng";
import { distanceM } from "../../../../../../utils/distance";

const STATUS_STYLES = {
  accepted: "border-blue-500/30 bg-blue-500/15 text-blue-300",
  arrived: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  ongoing: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
};

const primaryBtn =
  "min-h-11 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base";

// One label/value row – label on the left, value on the right (wraps nicely)
const Row = ({ label, children, valueClass = "" }) => (
  <div className="flex items-start justify-between gap-4 py-2 text-sm sm:text-base">
    <span className="shrink-0 text-gray-400">{label}</span>
    <span
      className={`min-w-0 break-words text-right font-medium ${valueClass}`}
    >
      {children}
    </span>
  </div>
);

const Ride = ({ rideData, setRideData, driverCoordinates }) => {
  const { rideUrl, accessToken } = useContext(StoreContext);
  const [arrving, setArrving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [nearDrop, setNearDrop] = useState(false);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (rideData?.status !== "ongoing") return;
    const drop = toLatLng(rideData?.dropLocation);
    if (!driverCoordinates?.lat || !drop) return;
    const d = distanceM(driverCoordinates, drop);
    setDistance(Math.round(d / 1000));
    setNearDrop((prev) => (prev ? d <= 200 : d <= 150));
  }, [driverCoordinates, rideData]);

  const handleArrived = async () => {
    try {
      setArrving(true);
      await axios.post(
        `${rideUrl}/${rideData?._id}/arrived`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      toast.success("OTP sent to rider. Ask the rider for it");
      setRideData((prev) => ({ ...prev, status: "arrived" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not mark as arrived");
    } finally {
      setArrving(false);
    }
  };

  const handleComplete = async () => {
    try {
      setCompleting(true);
      const response = await axios.post(
        `${rideUrl}/rideComplete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.message) {
        setRideData(null);
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setCompleting(false);
    }
  };

  const status = rideData?.status;
  const phone = rideData?.rider?.phone;

  return (
    <section className="flex w-full flex-col gap-3 rounded-2xl border border-gray-600/60 bg-white/[0.03] p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold sm:text-xl">Ride Details</h3>
        {status && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
              STATUS_STYLES[status] ?? "border-gray-600 text-gray-300"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="divide-y divide-gray-700/50 border-y border-gray-700/50">
        <Row label="Rider Name:">{rideData?.rider?.name}</Row>
        <Row label="Pickup:">{rideData?.pickupLocation?.address}</Row>
        <Row label="Destination:">{rideData?.dropLocation?.address}</Row>
        <Row label="Distance:">{rideData?.distance} KM</Row>
        <Row label="Fare:" valueClass="text-green-500">
          ₹{rideData?.fare}
        </Row>
        <Row label="Rider Contact:">
          {phone ? (
            <a
              href={`tel:+91${phone}`}
              className="text-emerald-400 hover:underline"
            >
              +91 {phone}
            </a>
          ) : (
            "--"
          )}
        </Row>
      </div>

      {/* Actions */}
      {status === "accepted" && (
        <button
          onClick={handleArrived}
          disabled={arrving}
          className={primaryBtn}
        >
          {arrving ? "Marking as arrived..." : "Arrived at Pickup"}
        </button>
      )}

      {status === "ongoing" &&
        (nearDrop ? (
          <button
            onClick={handleComplete}
            disabled={completing}
            className={primaryBtn}
          >
            {completing ? "Completing..." : "Complete Ride"}
          </button>
        ) : (
          <p className="rounded-lg border border-emerald-600/40 bg-emerald-600/10 p-3 text-center text-sm font-medium text-emerald-300">
            {distance ?? "--"} km away from destination
          </p>
        ))}

      {status === "arrived" && (
        <OtpForm
          rideId={rideData._id}
          rideUrl={rideUrl}
          accessToken={accessToken}
          onStarted={() =>
            setRideData((prev) => ({ ...prev, status: "ongoing" }))
          }
        />
      )}
    </section>
  );
};

export default Ride;