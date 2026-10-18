const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        default: "",
      },
    },
    dropLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        default: "",
      },
    },
    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "arrived",
        "ongoing",
        "completed",
        "cancelled",
        "expired"
      ],
      default: "requested",
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiresAt: {
      type: Date,
    },
    fare: {
      type: Number,
      default: 0,
    },
    notifiedDrivers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [],
    },
    distance: {
      type: Number,
      default: 0,
    },
    vehicleType: {
      type: String,
      enum: ["car", "bike", "auto"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      default:"cash"
    },
    paymentDetails:{
      razorpayOrderId:{
        type:String,
        default:null
      },
      razorpayPaymentId:{
        type:String,
        default:null
      }
    },
    requestedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    expiresAt:{
      type: Date,
    }
  },
  { timestamps: true },
);

rideSchema.index({ pickupLocation: "2dsphere" });

const rideModel = mongoose.model("ride", rideSchema);

module.exports = rideModel;
