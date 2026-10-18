const mongoose = require("mongoose");

const driverProfileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        unique:true
    },
    licenseNumber:{
        type:String,
        trim:true,
        default:""
    },
    licenseImage:{
        url:{
            type:String,
            default:""
        },
        publicId:{
            type:String,
            default:null
        }
    },
    vehicle:{
        make:{
            type:String,
            trim:true,
            default:""
        },
        model:{
            type:String,
            trim:true,
            default:""
        },
        color:{
            type:String,
            trim:true,
            default:""
        },
        vehicleNumber:{
            type:String,
            trim:true,
            default:""
        },
        vehicleType:{
            type:String,
            enum:["car","bike","auto"],
            default:"car"
        }
    },

    verificationStatus:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"approved"
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    availability:{
        type:String,
        enum:["available","unavailable","onRide"],
        default:"available"
    },
    walletBalance:{
        type:Number,
        default:0
    }
    ,
    currentLocation:{
        type:{
            type:String,
            enum:["Point"],
            default:"Point"
        },

        coordinates:{
            type:[Number],
            default:[0,0]
        }
    },

},{timestamps:true})

driverProfileSchema.index({
  currentLocation: "2dsphere",
});

const driverProfileModel = mongoose.model("driverProfile",driverProfileSchema);

module.exports = driverProfileModel;