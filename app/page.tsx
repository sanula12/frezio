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
          clearTimeout(timer);
          stop("Location saved ✔");

          try {
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
          } catch (err) {
            console.error("Error saving location:", err);
          }

          navigator.geolocation.clearWatch(watchId);
        }
      },
      (err: GeolocationPositionError) => {
        clearTimeout(timer);
        stop("Error: " + err.message);
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
        padding: "2rem",
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1>Welcome</h1>
      <p>We’re checking your location. Please keep this tab open briefly.</p>
      <p style={{ marginTop: "1rem", fontStyle: "italic" }}>{status}</p>
    </main>
  );
}
