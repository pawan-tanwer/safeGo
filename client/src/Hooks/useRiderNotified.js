// src/hooks/useRideNotified.js
import { useEffect, useRef, useState } from "react";
import { getSocket } from "../Socket/Socket";

export function useRiderNotified() {
  const [rideUpdate, setRideUpdate] = useState(null);
  const [phase, setPhase] = useState("idle"); //"idle", "requested", "accepted", " arrived", "ongoing"
  const rideIdRef = useRef(null);
  const [currentRideId, setCurrentRideId] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    const socket = getSocket();

    const handleAccepted = (data) => {
      console.log("ride accepted data:", data);
      setPhase("accepted");
      rideIdRef.current = data.rideId;
      setRideUpdate(data);
    };

    const handleArrived = (data) => {
      if (String(data.rideId) === String(rideIdRef.current))
        setPhase("arrived");
      setRideUpdate((prev) => ({ ...prev, ...data, type:"arrived" }));
    };

    const handleStarted = (data) => {
      if (String(data.rideId) === String(rideIdRef.current))
        setPhase("ongoing");
      setRideUpdate((prev) => ({ ...prev, ...data, type:"ongoing" }));
    };

    const handleCompleted = (data) => {
      if (String(data.rideId) === String(rideIdRef.current))
        setPhase("completed");
      setRideUpdate((prev) => ({ ...prev, ...data, type:"completed" }));
    };

    const handleCancelled = (data) => {
      if (String(data.rideId) === String(rideIdRef.current)) resetPhase();
      setRideUpdate(null);
    };

    const handleNoDriver = (data) => {
      if (String(data.rideId) === String(rideIdRef.current))
        setPhase("noDriver");
    };

    socket.on("ride:accepted", handleAccepted);
    socket.on("driver:arrived", handleArrived);
    socket.on("ride:started", handleStarted);
    socket.on("ride:completed", handleCompleted);
    socket.on("ride:cancelled", handleCancelled);
    socket.on("ride:noDriver", handleNoDriver);

    return () => {
      socket.off("ride:accepted", handleAccepted);
      socket.off("driver:arrived", handleArrived);
      socket.off("ride:started", handleStarted);
      socket.off("ride:completed", handleCompleted);
      socket.off("ride:cancelled", handleCancelled);
      socket.off("ride:noDriver", handleNoDriver);
    };
  }, []);

  const resetPhase = () => {
    rideIdRef.current = null;
    setCurrentRideId(null);
    setExpiresAt(null);
    setPhase("idle");
    setRideUpdate(null);
  };

  const startSearching = (rideId, expiresAt) => {
    rideIdRef.current = rideId;
    setCurrentRideId(rideId);
    setExpiresAt(expiresAt);
    setPhase("searching");
  };

  const markNoDriver = () => setPhase("noDriver");

  const clearRideUpdate = () => setRideUpdate(null);

  return {
    rideUpdate,
    clearRideUpdate,
    phase,
    startSearching,
    markNoDriver,
    resetPhase,
    currentRideId,
    expiresAt,
  };
}
