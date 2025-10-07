import React from "react";

/* Muted gray icons for pills */
const iconStyle = {
  marginRight: 6,
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
    switch (state) {
      case "Completed":
        return { background: "#0096d6" }; // blue
      case "Aborted":
        return { background: "#d93025" }; // red
      case "Printing":
      default:
        return { background: "#0c7041" }; // green
    }
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

  return (
    <article
      className="status-card"
      style={{
        width: 360,
        maxWidth: 360,
        padding: 0,
        overflow: "hidden",
        borderRadius: 12,
      }}
    >
      {/* === Modal-style Title Section === */}
      <div className="simpleui-modal-title">
        <div className="simpleui-modal-title__text">{printerName}</div>
        {printerState && (
          <span
            className="simpleui-modal-badge"
            style={getChipColor(printerState)}
          >
            {printerState}
          </span>
        )}
      </div>

      {/* === Card Body === */}
      <div className="simpleui-card-body">
        {/* Job */}
        <div className="simpleui-row">
          <span className="simpleui-label">Job:</span>
          <span className="simpleui-jobname" title={jobName}>
            {jobName}
          </span>
        </div>

        {/* Progress */}
        <div className="simpleui-row--progress">
          <span>Progress:</span>
          <span>{pct}%</span>
        </div>

        <div className="progress-bar-container" style={{ height: 12 }}>
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
          <div className="simpleui-pill">
            <ClockIcon />
            {printerState === "Completed" ? "Complete" : timeRemaining ?? "—"}
          </div>
          {material && (
            <div className="simpleui-pill">
              <DropletIcon />
              {material}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="simpleui-meta">
          {
            <div>
              <span className="simpleui-meta__label">Started: </span>
              <span className="simpleui-meta__value">{startTime}</span>
            </div>
          }
          {
            <div>
              <span className="simpleui-meta__label">Ended: </span>
              <span className="simpleui-meta__value">{endTime}</span>
            </div>
          }
        </div>
      </div>
    </article>
  );
}
