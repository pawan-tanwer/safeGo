const driverProfileModel = require("../models/driverProfile.js");
const uploadToCloudinary = require("../utils/uploadToCloudinary.js");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary.js");
const rideModel = require("../models/ride.js");
const { getPeriodRange, normalizePeriod } = require("../utils/earnigPeriod.js");
const mongoose = require("mongoose")

const createDriverProfile = async (req, res) => {
  try {
    const { licenseNumber } = req.body;
    console.log(req.body);
    const licenseImageFile = req.file;
    console.log(req.file);

    let vehicle;
    try {
      vehicle = JSON.parse(req.body.vehicle);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vehicle data" });
    }

    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Only driver can create driver profile",
      });
    }

    const isProfileExist = await driverProfileModel.findOne({
      user: req.user._id,
    });

    if (isProfileExist) {
      return res.status(409).json({
        success: false,
        message: "Driver profile already exist",
      });
    }
    if (
      !licenseNumber ||
      !licenseImageFile ||
      !vehicle?.make ||
      !vehicle?.model ||
      !vehicle?.vehicleNumber ||
      !vehicle?.color ||
      !vehicle?.vehicleType
    ) {
      return res.status(400).json({
        success: false,
        message: "all driver and vehicle details are required",
      });
    }

    const result = await uploadToCloudinary(
      licenseImageFile.buffer,
      "driver-licenses",
    );

    const driverProfile = await driverProfileModel.create({
      user: req.user._id,
      licenseNumber,
      licenseImage: {
        url: result.secure_url,
        publicId: result.public_id,
      },
      vehicle,
    });

    return res.status(201).json({
      success: true,
      message: "Driver profile submitted successfully",
      driverProfile,
    });
  } catch (error) {
    console.error("driverProfile error :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getDriverProfile = async (req, res) => {
  try {
    const driverProfile = await driverProfileModel.findOne({
      user: req.user._id,
    });
    if (!driverProfile) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      driverProfile,
    });
  } catch (error) {
    console.error("get DriverProfile error :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateDriverOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;

    if (typeof isOnline !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isOnline must be true or false",
      });
    }

    const driverProfile = await driverProfileModel.findOne({
      user: req.user._id,
    });
    if (!driverProfile) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    if (driverProfile.verificationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Driver's account is not approved",
      });
    }

    const min_wallet_balance = -100;

    if (isOnline) {
      if (driverProfile.walletBalance < min_wallet_balance) {
        return res.status(403).json({
          success: false,
          message: `Your wallet balance is low(${driverProfile.walletBalance}). Please clear your dues to go online`,
        });
      }
    }

    driverProfile.isOnline = isOnline;
    driverProfile.availability = isOnline ? "available" : "unavailable";
    await driverProfile.save();

    return res.status(200).json({
      success: true,
      message: isOnline ? "Driver is now Online" : "Driver is now Offline",
      isOnline: driverProfile.isOnline,
      availability: driverProfile.availability,
    });
  } catch (error) {
    console.error("updateDriverOnlineStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateDriverProfile = async (req, res) => {
  try {
    const { licenseNumber, vehicle } = req.body;

    const driverProfile = await driverProfileModel.findOne({
      user: req.user._id,
    });
    const oldPublicId = driverProfile?.licenseImage?.publicId;

    if (!driverProfile) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }
    if (licenseNumber) {
      driverProfile.licenseNumber = licenseNumber;
    }

    if (vehicle?.make) {
      driverProfile.vehicle.make = vehicle?.make;
    }

    if (vehicle?.model) {
      driverProfile.vehicle.model = vehicle?.model;
    }

    if (vehicle?.color) {
      driverProfile.vehicle.color = vehicle?.color;
    }

    if (vehicle?.vehicleNumber) {
      driverProfile.vehicle.vehicleNumber = vehicleNumber;
    }

    if (vehicle?.vehicleType) {
      driverProfile.vehicle.vehicleType = vehicle?.vehicleType;
    }

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "driver-licenses",
      );

      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId);
      }
      driverProfile.licenseImage.url = result.secure_url;
      driverProfile.licenseImage.publicId = result.public_id;
      console.log("result :", result);
    }

    await driverProfile.save();

    return res.status(200).json({
      success: true,
      message: "Profile update successfully",
    });
  } catch (error) {
    console.error("updateLicenseImage error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const COMMISSION_RATE = 0.2; 
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

const getEarningDetails = async (req, res) => {
  try {
    const driverId = req.user?._id; // set by your auth middleware
    if (!driverId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
 
    const period = normalizePeriod(req.body?.period);
    const range = period && getPeriodRange(period);
    if (!range) {
      return res.status(400).json({
        success: false,
        message: "Invalid period. Send today, week or month",
      });
    }
 
    const [result] = await rideModel.aggregate([
      {
        $match: {
          // aggregate() does NOT auto-cast strings to ObjectId (find() does), so cast here
          driver: new mongoose.Types.ObjectId(driverId),
          status: "completed",
          // a ride counts in the period it was FINISHED, not when it was requested
          completedAt: { $gte: range.from, $lte: range.to },
        },
      },
      {
        $group: {
          _id: null,
          grossFare: { $sum: "$fare" },
          ridesCompleted: { $sum: 1 },
        },
      },
    ]);
 
    // no completed rides in the period -> aggregate returns [] -> result is undefined
    const grossFare = round2(result?.grossFare ?? 0);
    const commission = round2(grossFare * COMMISSION_RATE);
    const netEarning = round2(grossFare - commission);
 
    return res.status(200).json({
      success: true,
      period, // normalized: "today" | "week" | "month"
      from: range.from,
      to: range.to,
      commissionRate: COMMISSION_RATE,
      grossFare,
      commission,
      netEarning,
      ridesCompleted: result?.ridesCompleted ?? 0,
    });
  } catch (error) {
    console.error("getEarningDetails error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not load earnings" });
  }
};

const startOfTodayIST = () => {
  const OFFSET = 5.5 * 60 * 60 * 1000;
  const d = new Date(Date.now() + OFFSET);
  d.setUTCHours(0, 0, 0, 0);
  return new Date(d.getTime() - OFFSET);
};

const COMMISSION_PERCENT = 20
const driverRides = async (req, res) => {
  try {
    const driverId = new mongoose.Types.ObjectId(req.user._id);

    const [todayAgg, totalAgg, profile] = await Promise.all([
      rideModel.aggregate([
        {
          $match: {
            driver: driverId,
            status: "completed",
            completedAt: { $gte: startOfTodayIST() },
          },
        },
        { $group: { _id: null, gross: { $sum: "$fare" } } },
      ]),
      rideModel.countDocuments({ driver: driverId, status: "completed" }),
      driverProfileModel.findOne({ user: driverId }).select("walletBalance"),
    ]);

    const gross = todayAgg[0]?.gross ?? 0;
    const todayEarning = gross - Math.round((gross * COMMISSION_PERCENT) / 100);

    return res.status(200).json({
      success: true,
      driver:{
        todayEarning,
      ridesCompleted: totalAgg,
      walletBalance: profile?.walletBalance ?? 0,
      }
    });
  } catch (error) {
    console.error("driverRides error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
 

module.exports = {
  createDriverProfile,
  getDriverProfile,
  updateDriverOnlineStatus,
  updateDriverProfile,
  getEarningDetails,
  driverRides
};
