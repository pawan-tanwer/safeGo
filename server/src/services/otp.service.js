const crypto = require("crypto");
const otpModel = require("../models/opt.model.js");

const generateOTP = ()=>{
    return crypto.randomInt(100000, 1000000).toString();
}

const createOtp = async(email,type)=>{
    await otpModel.deleteMany({email,type});
    const otp = generateOTP();

    await otpModel.create({
        email,
        otp,
        type:type,
        expiresAt: new Date(Date.now() + 5*60*1000)
    })

    return otp;
};

const createPhoneOtp = async(phone,type)=>{
    await otpModel.deleteMany({phone,type});
    const otp = generateOTP();

    await otpModel.create({
        phone,
        otp,
        type,
        expiresAt:new Date(Date.now() + 5*60*1000)
    });

    return otp;
}

module.exports={
    createOtp,
    createPhoneOtp
}