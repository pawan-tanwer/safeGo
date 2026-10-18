const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      trim: true,
    },
    role: {
      type: String,
      enum: ["rider", "driver"],
      default: "rider",
    },
    profileImage: {
      url: {
        type: String,
        default: "",
      },
      publicId:{
        type:String,
        default:null
      }
    },
    provider:{
      type:String,
      enum:["local","google"],
      default:"local"
    },
    isEmailVerified: {
      type: Boolean,  
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOnline:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
