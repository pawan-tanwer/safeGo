const driverProfileModel = require("../models/driverProfile.js");
const rideModel = require("../models/ride.js");
const userModel = require("../models/user.model.js")
const { getIO } = require("../socket/socket.js");
const { formatDateTime} = require("../utils/formatDate")

const totalRidesData = async(req,res)=>{
try {
  const rides = await rideModel.find({
    rider:req.user._id,
  }).sort({ createdAt: -1 })   // nayi ride sabse pehle
  .lean();
  const completedRides = rides.filter((ride)=> ride.status=="completed");
  const totalSpent = completedRides.reduce((sum,ride)=>sum + ride.fare,0);
  const lastRideDate = completedRides.length
  ? new Date(Math.max(...completedRides.map((r) => r.completedAt)))
  : null;

  const formatted = rides.map((ride) => ({
  ...ride,
  completedAtText: formatDateTime(ride.completedAt),
  createdAtText: formatDateTime(ride.createdAt),
}));
  return res.status(200).json({
    success:true,
    rides:{
      rides:rides.length,
      completed:completedRides.length,
      totalSpent,
      lastRideDate:formatted
    },
    totalRides:rides
  })
} catch (error) {
  
}
}

const findNearByDrivers = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Location is required ",
      });
    }

    const nearByDrivers = await driverProfileModel
      .find({
        isOnline: true,
        availability: "available",
        verificationStatus: true,
        currentLocation: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 5000, // 5km
          },
        },
      })
      .populate("user", "name,phone,profileImage");

    return res.status(200).json({
      success: true,
      drivers: nearByDrivers,
    });
  } catch (error) {
    console.log("find near Drivers :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const calculateFare = (distanceInKm, vehicleType) => {
  const baseFare = { car: 40, bike: 20, auto: 25 };
  const perKmRate = { car: 12, bike: 6, auto: 8 };

  const base = baseFare[vehicleType] || 30;
  const rate = perKmRate[vehicleType] || 10;

  const fare = base + distanceInKm * rate;
  return Math.round(fare);
};

const createRideRequest = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, vehicleType} = req.body;

    if (
      !pickupLocation.lat ||
      !pickupLocation.lng||
      !dropLocation.lat||
      !dropLocation.lng ||
      !vehicleType
    ) {
      return res.status(400).json({
        success: false,
        message: "pickup ,drop location and vehicle Type is requred ",
      });
    }

    const distanceInMeters = getDistanceInMeters(
      pickupLocation.lat,
      pickupLocation.lng,
      dropLocation.lat,
      dropLocation.lng,
    );

    const distanceInKm = distanceInMeters / 1000;
    const estimateFare = calculateFare(distanceInKm, vehicleType);

    const SEARCH_MS = 2 * 60 * 1000; 

    const newRide = await rideModel.create({
      rider: req.user._id,
      pickupLocation: {
        type: "Point",
        coordinates: [pickupLocation.lng, pickupLocation.lat],
        address: pickupLocation.address || "",
      },
      dropLocation: {
        type: "Point",
        coordinates: [dropLocation.lng, dropLocation.lat],
        address: dropLocation.address || "",
      },
      vehicleType,
      status: "requested",
      fare: estimateFare,
      distance: Math.round(distanceInKm),
      expiresAt: new Date(Date.now() + SEARCH_MS),
    });

    const nearbyDrivers = await driverProfileModel.find({
      isOnline: true,
      verificationStatus:"approved",
      "vehicle.vehicleType": vehicleType,
      availability: "available",
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [pickupLocation.lng, pickupLocation.lat],
          },
          $maxDistance: 5000, //5km
        },
      },
    });
console.log(" length :",nearbyDrivers.length)
    if (nearbyDrivers.length === 0) {
        newRide.status ="expired";
        await newRide.save();
      return res.status(200).json({
        success: false,
        noDriver:true,
        message: "No Driver available nearby right now .",
        ride: newRide,
      });
    }

    const riderData = await userModel.findById(req.user._id).select("name phone");
    const io = getIO();

    nearbyDrivers.forEach((driver) => {

      const distanceToDriver = getDistanceInMeters(
        pickupLocation.lat,pickupLocation.lng,driver.currentLocation.coordinates[1],driver.currentLocation.coordinates[0]
      )

      io.to(`driver_${driver.user}`).emit("ride:newRequest", {
        rideId: newRide._id,
        phone:riderData.phone,
        riderName:riderData.name,
        riderId: newRide.rider,
        pickupLocation: newRide.pickupLocation,
        dropLocation: newRide.dropLocation,
        vehicleType: newRide.vehicleType,
        fare: newRide.fare,
        distanceToPickup:(distanceToDriver/ 1000).toFixed(1),
      });
    });

    newRide.notifiedDrivers = nearbyDrivers.map((driver) => driver.user);
    await newRide.save();

    setTimeout(async()=>{
      try{
        const expired = await rideModel.findOneAndUpdate(
          {_id:newRide._id,status:"requested"},
          {$set:{status:"expired"}},
          {returnDocument:'after'}
        );
        if(!expired) return;

        io.to(`rider_${expired.rider}`).emit("ride:noDriver",
          {
            rideId: expired._id,
          }
        )

        expired.notifiedDrivers.forEach((d)=>{
            io.to(`driver_${d}`).emit("ride:unavailable",
              {
                rideId: expired._id,
              }
            )
        })
      }
      catch(error){
        console.error(error)
      }
    },SEARCH_MS)
    
    console.log("complete")
    return res.status(201).json({
      success: true,
      message: "Searching nearby drivers...",
      ride: newRide,
      expiresAt: newRide.expiresAt,
      notifiedDrivers: nearbyDrivers.length,
    });
  } catch (error) {
    console.log("createRideRequest error :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",  
    });
  }
};

const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user._id;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const updatedRide = await rideModel.findOneAndUpdate(
      {_id:rideId, status:"requested", expiresAt:{$gt : new Date()} },
      {status:"accepted", driver:driverId, acceptedAt:new Date(), otp:otp,},
      {returnDocument:'after'}
    ).populate("rider", "name phone profileImage");

    if(!updatedRide){
      return res.status(409).json({
        success:false,
        message:"Ride is no longer available or has expired"
      })
    }

    const driverProfile = await driverProfileModel.findOneAndUpdate(
      { user: driverId },
      {
        availability: "onRide",
      },
      {
        returnDocument: "after",
      },
    );

    const io = getIO();

    io.to(`rider_${updatedRide.rider._id}`).emit("ride:accepted", {
      rideId: updatedRide._id,
      driver: {
        id: driverId,
        name: req.user.name,
        phone: req.user.phone,
      },
      carDetails:{
        make:driverProfile.vehicle.make,
        model:driverProfile.vehicle.model,
        color:driverProfile.vehicle.color,
        vehicleNumber:driverProfile.vehicle.vehicleNumber
      },
      rideDetails:{
        pickupLocation:updatedRide?.pickupLocation,
        dropLocation:updatedRide?.dropLocation,
        fare:updatedRide?.fare,
        distance:updatedRide?.distance
      }
    });

    updatedRide.notifiedDrivers.forEach((notifiedDriverId) => {
      if (notifiedDriverId.toString() !== driverId.toString()) {
        io.to(`driver_${notifiedDriverId}`).emit("ride:unavailable", {
          rideId: updatedRide._id,
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Ride accepted successfuly",
      ride: updatedRide,
    });
  } catch (error) {
    console.error("acceptRide error :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const ARRIVAL_THRESHOLD_M = 150;

const arrivedAtPickup = async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user._id; // req.user_id nahi

    const ride = await rideModel
      .findOne({ _id: rideId, driver: driverId, status: "accepted" })
      .select("pickupLocation");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found, not yours, or already past this stage",
      });
    }

    const driverProfile = await driverProfileModel
      .findOne({ user: driverId })
      .select("currentLocation");

    const coords = driverProfile?.currentLocation?.coordinates;
    if (!coords || coords.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Your location is not available. Check GPS.",
      });
    }

    const [driverLon, driverLat] = coords;
    const [pickupLon, pickupLat] = ride.pickupLocation.coordinates;
    const distance = getDistanceInMeters(driverLat, driverLon, pickupLat, pickupLon);

    if (distance > ARRIVAL_THRESHOLD_M) {
      return res.status(400).json({
        success: false,
        message: `You are still ${Math.round(distance)} m away from pickup location`,
      });
    }

    // atomic: cancel ke saath race ho toh ek hi jeetega
    const updated = await rideModel
      .findOneAndUpdate(
        { _id: rideId, driver: driverId, status: "accepted" },
        { $set: { status: "arrived", arrivedAt: new Date() } },
        { returnDocument: "after" }
      )
      .select("+otp");

    if (!updated) {
      return res.status(409).json({ success: false, message: "Ride state changed" });
    }

    const io = getIO();
    io.to(`rider_${updated.rider}`).emit("driver:arrived", {
      rideId: updated._id,
      otp: updated.otp, // sirf rider ke room mein
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to rider",
      status: "arrived",
    });
  } catch (error) {
    console.error("arrivedAtPickup error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const startRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { otp } = req.body;
    const driverId = req.user._id;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required to start the ride",
      });
    }

    const ride = await rideModel.findOne({
      _id: rideId,
      driver: driverId,
      status: "arrived",
    }).select("+otp");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }


    if (ride.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP ",
      });
    }

    ride.status = "ongoing";
    await ride.save();

    const updatedRide = await ride.populate("rider", "name phone profileImage");

    const io = getIO();
    io.to(`rider_${updatedRide.rider._id}`).emit("ride:started", {
      rideId: updatedRide._id,
    });

    return res.status(200).json({
      success: true,
      message: "Ride started",
      ride: updatedRide,
    });
  } catch (error) {
    console.error("startRide error :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const COMPLETE_RADIUS_M = 300;
const MAX_LOC_AGE_MS = 15000;

const completeRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user._id;

    const ride = await rideModel
      .findOne({ _id: rideId, driver: driverId, status: "ongoing" })
      .select("dropLocation fare paymentMethod");
    if (!ride) return res.status(404).json({ success: false, message: "Ride cannot be completed" });

    const profile = await driverProfileModel
      .findOne({ user: driverId }).select("currentLocation locationUpdatedAt");
    const loc = profile?.currentLocation?.coordinates;
    if (!loc || Date.now() - new Date(profile.locationUpdatedAt) > MAX_LOC_AGE_MS) {
      return res.status(400).json({ success: false, message: "Your location is not updating. Check GPS." });
    }

    const [dLng, dLat] = ride.dropLocation.coordinates;
    const dist = getDistanceInMeters(dLat, dLng, loc[1], loc[0]);
    if (dist > COMPLETE_RADIUS_M) {
      return res.status(400).json({ success: false, message: `You are ${Math.round(dist)} m from drop location` });
    }

    // atomic: sirf ek baar complete ho (double click / cancel race)
    const done = await rideModel.findOneAndUpdate(
      { _id: rideId, driver: driverId, status: "ongoing" },
      { $set: {
          status: "completed",
          completedAt: new Date(),
          ...(ride.paymentMethod === "cash" && { paymentStatus: "paid" }),
        } },
      { returnDocument: "after" }
    );
    if (!done) return res.status(409).json({ success: false, message: "Ride state changed" });

    // commission: sirf ek baar, ride jeetne ke baad
    if (done.paymentMethod === "cash") {
      const commission = Math.round((done.fare * 20) / 100);
      await driverProfileModel.updateOne({ user: driverId }, { $inc: { walletBalance: -commission } });
    }

    await driverProfileModel.updateOne({ user: driverId }, { $set: { availability: "available" } });

    const io = getIO();
    io.to(`rider_${done.rider}`).emit("ride:completed", {
      rideId: done._id, fare: done.fare, distance: done.distance,
    });

    return res.status(200).json({ success: true, message: "Ride completed" });
  } catch (error) {
    console.error("completeRide error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const CANCELLABLE = ["requested", "accepted", "arrived"]; // ongoing pe cancel mat do

const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.user._id;

    // atomic: sirf rider ya assigned driver, aur sirf cancellable status pe
    const ride = await rideModel.findOneAndUpdate(
      {
        _id: rideId,
        status: { $in: CANCELLABLE },
        $or: [{ rider: userId }, { driver: userId }],
      },
      { $set: { status: "cancelled", cancelledAt: new Date(), cancelledBy: userId } },
      { returnDocument: "before" } // purana status chahiye
    );

    if (!ride) {
      return res.status(409).json({
        success: false,
        message: "Ride cannot be cancelled (already ended, started, or not yours)",
      });
    }

    const io = getIO();
    const isRider = ride.rider.toString() === userId.toString();

    if (ride.status === "requested") {
      // koi driver assigned nahi, notified drivers ke card hatao
      ride.notifiedDrivers.forEach((d) =>
        io.to(`driver_${d}`).emit("ride:unavailable", { rideId: ride._id })
      );
    } else if (ride.driver) {
      await driverProfileModel.updateOne(
        { user: ride.driver },
        { $set: { availability: "available" } } // asli fix
      );
      if (isRider) {
        io.to(`driver_${ride.driver}`).emit("ride:cancelled", { rideId: ride._id });
      }
    }

    if (!isRider) {
      io.to(`rider_${ride.rider}`).emit("ride:cancelled", { rideId: ride._id });
    }

    return res.status(200).json({ success: true, message: "Ride cancelled" });
  } catch (error) {
    console.error("cancelRide error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getRidePrices = async (req, res) => {
  try {
    const { pickupLocation, dropLocation } = req.body;

    const valid = (p) =>
      p && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng));

    if (!valid(pickupLocation) || !valid(dropLocation)) {
      return res.status(400).json({
        success: false,
        message: "Valid pickup and drop location are required",
      });
    }

    const distanceInMeters = getDistanceInMeters(
      Number(pickupLocation.lat),
      Number(pickupLocation.lng),
      Number(dropLocation.lat),
      Number(dropLocation.lng)
    );

    const distanceInKm = distanceInMeters / 1000;

    const ridePrices = {
      car: calculateFare(distanceInKm, "car"),
      bike: calculateFare(distanceInKm, "bike"),
      auto: calculateFare(distanceInKm, "auto"),
    };

    return res.status(200).json({
      success: true,
      distance: Math.round(distanceInKm * 10) / 10,
      ridePrices,
    });
  } catch (error) {
    console.error("getRidePrices error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  findNearByDrivers,
  createRideRequest,
  acceptRide,
  arrivedAtPickup,
  startRide,
  completeRide,
  cancelRide,
  getRidePrices,
  totalRidesData
};

