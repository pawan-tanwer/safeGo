const express = require("express");
const cors = require("cors")
const cookieParser = require("cookie-parser");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// routes
const authRouter = require("./routes/auth.route.js");
const driverRouter= require("./routes/driver.route.js");
const rideRouter = require("./routes/ride.route.js")
app.use("/api/auth",authRouter);
app.use("/api/driver",driverRouter);
app.use("/api/ride",rideRouter);

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Server is running"
    })
})

module.exports = app;