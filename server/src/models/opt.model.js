const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        lowercase:true,
        trim:true,
        default:""
    },
    phone:{
        type:String,
        trim:true,
        default:""
    },
    otp:{
        type:String,
        required:true
    },
    type:{
        type:String,
        requried:true,
        enum:["email-verification","forgot-password","reset-password","phone-verification"]
    },
    attempts:{
        type:Number,
        default:0
    },
    expiresAt:{
        type:Date,
        required:true,
        index:{expires:0}
    }
},{timestamps:true});

const otpModel = mongoose.model("otp",otpSchema);

module.exports = otpModel;