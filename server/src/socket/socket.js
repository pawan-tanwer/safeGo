const { Server } = require("socket.io");
const driverProfileModel = require("../models/driverProfile");
const { verifyAccessToken } = require("../utils/jwt.js");
const rideModel = require("../models/ride.js");

let io;
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token is missing"));
      }

      const decoded = verifyAccessToken(token);

      socket.userId = decoded.userId;
      socket.role = decoded.role;
      next();
    } catch (error) {
      next(new Error("Invalid or expired error "));
    }
  });

  io.on("connection", (socket) => {
    console.log(`${socket.role} socket connected:`, socket.id);
    // Role ke hisaab se sahi room join karo
    if (socket.role === "driver") {
      socket.join(`driver_${socket.userId}`);
    } else if (socket.role === "rider") {
      socket.join(`rider_${socket.userId}`);
    }
    // Driver apni location bhejega is event ke through
    socket.on("driver:updateLocation", async ({ latitude, longitude }) => {
      try {
        const lat = Number(latitude);
        const lng = Number(longitude);
        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng) ||
          lat < -90 ||
          lat > 90 ||
          lng < -180 ||
          lng > 180
        ) {
          console.log("Invalid location data received");
          return;
        }

        const userId = socket.userId;
        const driverProfile = await driverProfileModel.findOne({
          user: userId,
        });

        if (!driverProfile) {
          return;
        }

        if (!driverProfile.isOnline) {
          return;
        }
        await driverProfileModel.findOneAndUpdate(
          { user: userId },
          {
            currentLocation: {
              type: "Point",
              coordinates: [longitude, latitude], // GeoJSON: [longitude, latitude]
            },
          },
        );

        console.log("driver id:",userId)

        const activeRide = await rideModel.findOne(
          {
            driver:userId,
            status:{$in :["accepted","arrived","ongoing"]}
          }
        ).select("rider").lean();

        console.log("active ride: ",activeRide)

        if(activeRide){
          const room = `rider_${activeRide.rider}`
          console.log("[relay] emitting to", room);
          io.to(`rider_${activeRide.rider}`).emit("driver:locationUpdate",{
            rideId:activeRide._id,
            latitude,
            longitude
          });
        }
        console.log(
          `Location updated for driver ${userId}: [${latitude}, ${longitude}]`,
        );
      } catch (error) {
        console.error("Location update error:", error.message);
      }
    });

    socket.on("disconnect", async () => {
      try {
        if (socket.role === "driver") {
          await driverProfileModel.findOneAndUpdate(
            { user: socket.userId },
            { isOnline: false },
          );
          console.log(
            `Driver ${socket.userId} disconnected and marked offline`,
          );
        } else {
          console.log(`Rider ${socket.userId} disconnected`);
        }
      } catch (error) {
        console.error("Disconnect update error:", error.message);
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized yet");
  }
  return io;
};

module.exports = { initSocket, getIO };
