const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware.js");
const authorize = require("../middleware/authorize.middleware.js");
const driverController = require("../controllers/driver.controller.js")
const upload = require("../middleware/upload.middleware.js")

router.post("/profile",authMiddleware,authorize("driver"),upload.single("licenseImage"),driverController.createDriverProfile);
router.get("/profile",authMiddleware,authorize("driver"),driverController.getDriverProfile);
router.post("/online-status",authMiddleware,authorize("driver"),driverController.updateDriverOnlineStatus);
router.post("/update-profile",authMiddleware,authorize("driver"),upload.single("licenseImage"),driverController.updateDriverProfile);
router.post("/earning",authMiddleware,driverController.getEarningDetails);
router.get("/driver-rides",authMiddleware,driverController.driverRides);


module.exports = router;  