import React from "react";
import { printerStateColor, printerStateType } from "../utils/common";

const iconStyle = {
  marginRight: 4,
  opacity: 0.7,
  color: "#cbd5e1",
};

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width={"15"} height={"15"} fill="currentColor" style={iconStyle}>
    <path d="M12 1.75A10.25 10.25 0 1 0 22.25 12 10.262 10.262 0 0 0 12 1.75Zm0 18.5a8.25 8.25 0 1 1 8.25-8.25A8.26 8.26 0 0 1 12 20.25Zm.75-12.5a.75.75 0 0 0-1.5 0v4.25c0 .2.08.39.22.53l2.75 2.75a.75.75 0 1 0 1.06-1.06L12.75 11V7.75Z" />
  </svg>
);

const ClockIconV2 = () => (
  <svg viewBox="0 0 24 24" width={"24"} height={"24"} fill="currentColor" style={{...iconStyle, marginRight: 0}}>
    <path d="M12 1.75A10.25 10.25 0 1 0 22.25 12 10.262 10.262 0 0 0 12 1.75Zm0 18.5a8.25 8.25 0 1 1 8.25-8.25A8.26 8.26 0 0 1 12 20.25Zm.75-12.5a.75.75 0 0 0-1.5 0v4.25c0 .2.08.39.22.53l2.75 2.75a.75.75 0 1 0 1.06-1.06L12.75 11V7.75Z" />
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={iconStyle}>
    <path d="M12 2.25s6.75 6.29 6.75 11.03A6.75 6.75 0 0 1 12 20.03a6.75 6.75 0 0 1-6.75-6.75C5.25 8.54 12 2.25 12 2.25Zm0 15.53a4.5 4.5 0 0 0 4.5-4.5c0-2.36-2.39-5.34-4.5-7.34-2.11 2-4.5 4.98-4.5 7.34a4.5 4.5 0 0 0 4.5 4.5Z" />
  </svg>
);

const FlagIcon = () => {
  return (
    <svg
      class="lucide lucide-flag"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}

const PlayIcon = () => {
  return (
    <svg
      class="lucide lucide-play-circle"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  )
}

export const LiveVideoIcon = () => {
  return (
    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M14 7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7Zm2 9.387 4.684 1.562A1 1 0 0 0 22 17V7a1 1 0 0 0-1.316-.949L16 7.613v8.774Z" clip-rule="evenodd"/>
    </svg>
  )
}

export default function PrinterSimpleCard({
  printerName,
  printerState,
  jobName,
  progress,
  timeRemaining,
  material,
  startTime,
  endTime,
  viewMode = "list",
  onShowFeed
}) {
  const pct = !isNaN(parseFloat(progress))
    ? `${Math.floor(parseFloat(progress) * 10) / 10}`
    : progress;

  const getChipColor = (state) => {
    switch (state) {
      case printerStateType.idle:
        return { background: printerStateColor.idle };
      case printerStateType.printing:
        return { background: printerStateColor.printing };
      case printerStateType.completed:
        return { background: printerStateColor.completed };
      case printerStateType.aborted:
        return { background: printerStateColor.aborted };
      default:
        return { background: printerStateColor.all };
    }
  };

  const getBarColor = (state) => {
    switch (state) {
      case printerStateType.completed:
        return "#10b981";
      case printerStateType.aborted:
        return "#f43f5e";
      default:
        return "#22c55e";
    }
  };

  const getNameForPrinterState = (state) => {
    switch (state) {
      case printerStateType.idle:
        return "Idle";
      case printerStateType.printing:
        return "Printing";
      case printerStateType.completed:
        return "Completed";
      case printerStateType.aborted:
        return "Aborted";
      default:
        return state;
    }
  };

  const getValidPCT = (pct) => {
    if(isNaN(parseFloat(pct))) {
      return "-"
    }
    return pct
  }

  const showFeed = () => {
    onShowFeed?.(printerName)
  }

  if (viewMode === "list") {
  return (
    <div
      className="printer-list-item"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#252525",
        borderRadius: 8,
        padding: "12px 20px",
        marginBottom: 8,
        border: "1px solid rgba(255,255,255,0.08)",
        fontSize: 15,
        color: "#f1f5f9",
      }}
    >
      {/* Printer name */}
      <div className="text-overflow-ellipsis" style={{ flex: 1, fontWeight: 600 }}>{printerName}</div>

      {/* Material */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          // justifyContent: "flex-start",
          whiteSpace: "nowrap",
          // maxWidth: "95%",
          // width: "95%",
          overflow: "hidden",
          // textOverflow: "ellipsis"
        }}
      >
        <span style={{ height: "20px"}}>
          <DropletIcon />
        </span>
        <span style={{overflow: "hidden", textOverflow: "ellipsis"}}>
          {typeof material === "string" && material ? material : "-"}
        </span>
      </div>

      {/* Job name */}
      <div style={{ flex: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{jobName || "—"}</div>

      {/* Start Time */}

      <div class="list-svg-data" style={{ flex: 0.7}}>
        <PlayIcon />
        <span className="text-overflow-ellipsis">
          {printerState === printerStateType.idle ? "-" : startTime || "-"}
        </span>
      </div>

      <div style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "center", flex: 0.5 }}>
        {printerState && <span
          className="simpleui-modal-badge"
          style={{
            ...getChipColor(printerState),
            fontSize: 13,
            padding: "4px 10px",
            borderRadius: 6,
            display: "inline-block",
            minWidth: 80, // keeps chip same width
            textAlign: "center",
          }}
        >
          {getNameForPrinterState(printerState)}
        </span>}
      </div>

      <div class="list-svg-data" style={{ flex: 0.5, justifyContent: "center" }}>
        <ClockIconV2 />
        {timeRemaining}
      </div>

      {/* Progress + bar + times */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 4,
          justifyContent: "center",
        }}
      >

        {/* Progress bar */}
        <div
          style={{
            flex: 1,
            height: 8,
            background: "#1e1e1e",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct > 0 ? pct : 0}%`,
              backgroundColor: getBarColor(printerState),
              height: "100%",
              borderRadius: 6,
            }}
          />
        </div>
        {/* % completed */}
        <div style={{ minWidth: 40, textAlign: "right" }}>{getValidPCT(pct)}%</div>

        {/* Start & End time side by side */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: 180,
            gap: 10,
            flex: 1.5,
            fontSize: 13,
            color: "#cbd5e1",
            marginRight: '0.5rem',
            marginLeft: '0.5rem'
          }}
        >
          {printerState !== printerStateType.idle && <div class="list-svg-data">
            <PlayIcon />
            {printerState === printerStateType.idle ? "-" : startTime || "-"}
          </div>}
          {printerState !== printerStateType.idle && <div class="list-svg-data">
            <FlagIcon />
            {printerState === printerStateType.idle ? "-" : endTime || "-"}
          </div>}
          <div class="list-svg-data">
            <ClockIconV2 />
            {timeRemaining}
          </div>
        </div> */}

      </div>

      {/* Time Remaining + Material Chips */}
      {/* <div
        style={{
          flex: 0.9,
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          gap: 8,
        }}
      >
        {timeRemaining && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#3a3a3a",
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
              whiteSpace: "nowrap",
            }}
          >
            <ClockIcon />
            {timeRemaining}
          </div>
        )}

        {material && typeof material == "string" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#3a3a3a",
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
              whiteSpace: "nowrap",
            }}
          >
            <DropletIcon />
            {material}
          </div>
        )}
      </div> */}

      {/* Status (right aligned) */}
      {/* <div style={{ flex: 0.5, textAlign: "right" }}>
        <span
          className="simpleui-modal-badge"
          style={{
            ...getChipColor(printerState),
            fontSize: 13,
            padding: "4px 10px",
            borderRadius: 6,
            display: "inline-block",
            minWidth: 80, // keeps chip same width
            textAlign: "center",
          }}
        >
          {getNameForPrinterState(printerState)}
        </span>
      </div> */}
      <div className="list-svg-data" style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "right", 
        cursor: "pointer", flex: 0.2}} onClick={showFeed}>
        <LiveVideoIcon />
      </div>
    </div>
  );
}

  // keep your existing card view unchanged
  return (
    <article
      className="status-card"
      style={{
        width: 295,
        maxWidth: 295,
        padding: 0,
        overflow: "hidden",
        borderRadius: 12,
        background: "#343434",
      }}
    >
      <div
        className="simpleui-modal-title"
        style={{
          background: "#343434",
          height: "32px",
          boxSizing: "border-box",
        }}
      >
        <div className="simpleui-modal-title__text font-s" style={{ color: "rgba(255,255,255, 0.7)" }}>
          {printerName}
        </div>
        <div style={{ display: "flex", gap: 8}}>
          <div className="list-svg-data" style={{ cursor: "pointer"}} onClick={showFeed}>
            <LiveVideoIcon />
          </div>
          {printerState && (
            <span className="simpleui-modal-badge font-s" 
              style={{
                ...getChipColor(printerState), 
                width: '84px', 
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
              {getNameForPrinterState(printerState)}
            </span>
          )}
        </div>
      </div>

      <div className="simpleui-card-body" style={{ background: "#252525", height: "100%" }}>
        <div className="simpleui-row" style={{ justifyContent: "left" }}>
          <span className="simpleui-label font-s" style={{ color: "rgba(255,255,255, 0.7)" }}>
            Job:
          </span>
          <span className="simpleui-jobname font-s" title={jobName}>
            {jobName}
          </span>
        </div>

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

        <div className="simpleui-pills">
          <div className="simpleui-pill font-s p-xxs" style={{ color: "rgba(255,255,255, 0.5)" }}>
            <ClockIcon />
            {printerState === printerStateType.completed ? "Complete" : timeRemaining ?? "—"}
          </div>
          {material && (
            <div className="simpleui-pill font-s p-xxs" style={{ color: "rgba(255,255,255, 0.5)" }}>
              <DropletIcon />
              {material}
            </div>
          )}
        </div>

        <div className="simpleui-meta">
          <div>
            <span
              className="simpleui-meta__label font-s"
              style={{ fontWeight: 500, color: "rgba(255,255,255, 0.4)" }}
            >
              Started:{" "}
            </span>
            <span
              className="simpleui-meta__value font-s"
              style={{ fontWeight: 500, color: "rgba(255,255,255, 0.5)" }}
            >
              {startTime}
            </span>
          </div>
          <div>
            <span
              className="simpleui-meta__label font-s"
              style={{ fontWeight: 500, color: "rgba(255,255,255, 0.4)" }}
            >
              Ended:{" "}
            </span>
            <span
              className="simpleui-meta__value font-s"
              style={{ fontWeight: 500, color: "rgba(255,255,255, 0.5)" }}
            >
              {endTime}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
