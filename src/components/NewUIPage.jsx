/**
 * NewUIPage.jsx
 * Renders compact cards using renamed props:
 * printerName, printerState, jobName, progress, timeRemaining, material, startTime, endTime
 */
import React from "react";
import PrinterSimpleCard from "./PrinterSimpleCard";
import { printerModelMap } from "../utils/common"; // same path you used in App.jsx

export default function NewUIPage({ printers = [] }) {
  return (
    <main
      style={{ minHeight: "100vh", 
      // background: "#111827", 
      background: "#1e1e1e", 
      color: "#e5e7eb" }}
    >
      <div 
        // style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}
        style={{ margin: "0 auto", padding: "24px 16px" }}
      >
        <h1 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>
          MTConnect Printer Dashboard
        </h1>

        <div
          style={{
            // display: "grid",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            // justifyContent: "space-between"
            // gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          }}
        >
          {printers
            .filter((p) => {
              const match = p.deviceStreamName?.match(/asset_(\d+)-/);
              return match?.[1] !== printerModelMap.EdgePC;
            })
            .map((data) => {
              const id = data.deviceStreamName;
              return (
                <PrinterSimpleCard
                  key={id}
                  printerName={data.printerName}
                  printerState={data.printerState}
                  jobName={data.jobName}
                  progress={data.progress}
                  timeRemaining={data.timeRemaining}
                  material={data.material}
                  startTime={data.startTime}
                  endTime={data.endTime}
                />
              );
            })}
        </div>
      </div>
    </main>
  );
}
