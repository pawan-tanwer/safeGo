const express = require("express");
const authController = require("../controllers/auth.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const router = express.Router();

router.post("/register",authController.register);
router.post("/verify-email",authController.verifyEmail);
router.post("/resend-otp",authController.resendOtp);
router.post("/login",authController.login);
router.post("/refresh-access-token",authController.refreshAccesstoken);

router.get("/logout",authMiddleware,authController.logout);
router.get("/send-phone-otp",authMiddleware,authController.sendPhoneOtp);

router.post("/forgot-password-otp",authController.forgotPasswordOtp);
router.post("/verify-forgotPassword-otp",authController.verifyForgotPasswordOtp);
router.post("/forgot-password",authController.forgotPassword)

router.post("/update",authMiddleware,authController.updateProfile)

router.post("/google",authController.googleAuth)

module.exports=router;