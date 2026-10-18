const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const authorize = require("../middleware/authorize.middleware.js")


router.post("/nearby-drivers",authMiddleware,authorize("rider"),rideController.findNearByDrivers);
router.post("/request",authMiddleware,authorize("rider"),rideController.createRideRequest)

router.get("/rideDetails",authMiddleware,rideController.totalRidesData)

// driver  
router.patch("/:rideId/accept",authMiddleware,authorize("driver"),rideController.acceptRide);
router.post("/:rideId/arrived",authMiddleware,authorize("driver"),rideController.arrivedAtPickup);
router.post("/:rideId/startRide",authMiddleware,authorize("driver"),rideController.startRide);
router.post("/:rideId/rideComplete",authMiddleware,authorize("driver"),rideController.completeRide);

// both rider and driver can hit this api

router.post("/:rideId/cancel",authMiddleware,rideController.cancelRide);

router.post("/ridePrices",rideController.getRidePrices);

module.exports = router;