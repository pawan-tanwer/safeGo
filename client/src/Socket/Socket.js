import { useContext } from "react";
import { io } from "socket.io-client";
let socket = null;

export const connectSocket = (token) => {

  if (socket) return socket;

  socket = io("http://localhost:8000", {
    auth: { token },
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection failed:", err.message);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized — call connectSocket first");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};