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
      style={{ minHeight: "100vh", background: "#111827", color: "#e5e7eb" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
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
