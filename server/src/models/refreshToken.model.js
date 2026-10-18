const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    token:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true,
        index:{expires:0}
    }
},{timestamps:true});

const refreshTokenModel = mongoose.model("refreshToken", refreshTokenSchema);

module.exports=refreshTokenModel
