"use client";

import { useEffect, useState } from "react";

interface Record {
  lat: number;
  lon: number;
  accuracy_m: number;
  timestamp: string;
  ip: string;
}

export default function ViewPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetch("/api/collect-location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method: "fetch" }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.ok) {
        setRecords(res.data || []);
      } else {
        console.error("API error:", res.error);
      }
    })
    .catch((err) => {
      console.error("Fetch failed:", err.message);
    });
}, []);



  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1>Collected Locations</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {records.length === 0 && !error ? (
        <p>No data yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                IP
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Lat
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Lon
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Accuracy (m)
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.ip}</td>
                <td>{r.lat}</td>
                <td>{r.lon}</td>
                <td>{Math.round(r.accuracy_m)}</td>
                <td>{new Date(r.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
