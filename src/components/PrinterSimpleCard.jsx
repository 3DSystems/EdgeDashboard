import React from "react";
import { printerStateColor, printerStateType } from "../utils/common";

/* Muted gray icons for pills */
const iconStyle = {
  marginRight: 4,
  opacity: 0.7,
  color: "#cbd5e1", // Tailwind gray-400 tone
};

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="currentColor"
    style={iconStyle}
  >
    <path d="M12 1.75A10.25 10.25 0 1 0 22.25 12 10.262 10.262 0 0 0 12 1.75Zm0 18.5a8.25 8.25 0 1 1 8.25-8.25A8.26 8.26 0 0 1 12 20.25Zm.75-12.5a.75.75 0 0 0-1.5 0v4.25c0 .2.08.39.22.53l2.75 2.75a.75.75 0 1 0 1.06-1.06L12.75 11V7.75Z" />
  </svg>
);

const DropletIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="currentColor"
    style={iconStyle}
  >
    <path d="M12 2.25s6.75 6.29 6.75 11.03A6.75 6.75 0 0 1 12 20.03a6.75 6.75 0 0 1-6.75-6.75C5.25 8.54 12 2.25 12 2.25Zm0 15.53a4.5 4.5 0 0 0 4.5-4.5c0-2.36-2.39-5.34-4.5-7.34-2.11 2-4.5 4.98-4.5 7.34a4.5 4.5 0 0 0 4.5 4.5Z" />
  </svg>
);

export default function PrinterSimpleCard({
  printerName,
  printerState,
  jobName,
  progress,
  timeRemaining,
  material,
  startTime,
  endTime,
}) {
  const pct = !isNaN(parseFloat(progress))
    ? `${Math.floor(parseFloat(progress) * 10) / 10}`
    : progress;

  const getChipColor = (state) => {
    switch(state) {
      case printerStateType.idle: {
        return { background: printerStateColor.idle, 
          // color: 'black' 
        }
      }
      case printerStateType.printing: {
        return { background: printerStateColor.printing }
      }
      case printerStateType.completed: {
        return { background: printerStateColor.completed, 
          // color: 'black' 
        }
      }
      case printerStateType.aborted: {
        return { background: printerStateColor.aborted }
      }
      default: {
        return { background: printerStateColor.all }
      }

    }
    // switch (state) {
    //   case "Completed":
    //     return { background: "#0096d6" }; // blue
    //   case "Aborted":
    //     return { background: "#d93025" }; // red
    //   case "Printing":
    //   default:
    //     return { background: "#0c7041" }; // green
    // }
  };

  const getBarColor = (state) => {
    switch (state) {
      case "Completed":
        return "#10b981";
      case "Aborted":
        return "#f43f5e";
      default:
        return "#22c55e";
    }
  };

  const getNameForPrinterState = (state) => {
    switch(state) {
      case printerStateType.idle: {
        return "Idle"
      }
      case printerStateType.printing: {
        return "Printing"
      }
      case printerStateType.completed: {
        return "Completed"
      }
      case printerStateType.aborted: {
        return "Aborted"
      }
      default: {
        return state
      }

    }
  }

  return (
    <article
      className="status-card"
      style={{
        width: 295,
        maxWidth: 295,
        padding: 0,
        overflow: "hidden",
        borderRadius: 12,
        background: "#343434"
      }}
    >
      {/* === Modal-style Title Section === */}
      <div className="simpleui-modal-title" 
        style={{ 
          background: "#343434",
          minheight: '38px'
        }}
      >
        <div className="simpleui-modal-title__text font-s" >{printerName}</div>
        {printerState && (
          <span
            className="simpleui-modal-badge font-s"
            style={getChipColor(printerState)}
          >
            {getNameForPrinterState(printerState)}
          </span>
        )}
      </div>

      {/* === Card Body === */}
      <div className="simpleui-card-body" style={{ background: "#252525", height: '100%'}}>
        {/* Job */}
        <div className="simpleui-row" style={{ justifyContent: 'left' }}>
          <span 
            className="simpleui-label font-s"
            style={{
              color: "rgba(255,255,255, 0.7)"
            }}
          >Job:</span> 
          <span className="simpleui-jobname font-s" title={jobName}>
            {jobName}
          </span>
        </div>

        {/* Progress */}
        <div className="simpleui-row--progress font-s">
          <span style={{ fontWeight: 500, color: "rgba(255,255,255, 0.5)" }}>Progress:</span>
          <span style={{ fontWeight: 500, color: "rgba(255,255,255, 0.5)" }}>{pct}%</span>
        </div>

        <div className="progress-bar-container" style={{ height: 8 }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${pct > 0 ? pct : 0}%`,
              backgroundColor: getBarColor(printerState),
              borderRadius: 8,
              height: "100%",
            }}
          />
        </div>

        {/* Pills with muted icons */}
        <div className="simpleui-pills">
          <div className="simpleui-pill font-s p-xxs" style={{color: "rgba(255,255,255, 0.5)"}}>
            <ClockIcon />
            {printerState === "Completed" ? "Complete" : timeRemaining ?? "—"}
          </div>
          {material && (
            <div className="simpleui-pill font-s p-xxs" style={{color: "rgba(255,255,255, 0.5)"}}>
              <DropletIcon />
              {material}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="simpleui-meta">
          {
            <div>
              <span className="simpleui-meta__label font-s" style={{ fontWeight: 500, color: "rgba(255,255,255, 0.4)" }}>Started: </span>
              <span className="simpleui-meta__value font-s" style={{ fontWeight: 500, color: "rgba(255,255,255, 0.5)" }}>{startTime}</span>
            </div>
          }
          {
            <div>
              <span className="simpleui-meta__label font-s" style={{ fontWeight: 500, color: "rgba(255,255,255, 0.4)" }}>Ended: </span>
              <span className="simpleui-meta__value font-s" style={{ fontWeight: 500, color: "rgba(255,255,255, 0.5)" }}>{endTime}</span>
            </div>
          }
        </div>
      </div>
    </article>
  );
}
