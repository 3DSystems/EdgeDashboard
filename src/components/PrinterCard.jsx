/**
 * PrinterCard.jsx
 *
 * This component represents an individual printer status card.
 * It displays summarized data about a printer such as:
 *  - Printer name and model
 *  - Build job name, progress, temperatures, layers
 *  - Printer, build, and manual operation state
 *  - Material information (with multi-line support and ellipsis overflow)
 *
 * Features:
 *  - Dynamic expansion: Only one card expands at a time to show detailed job data.
 *  - Styled with a gradient background and a consistent layout.
 *  - Uses SVG icons (loaded locally from /public/icons) to represent data visually.
 *  - Displays an animated progress bar with percentage and layer tracking.
 *  - Includes a "More Details" modal toggle button for full ComponentStream message display.
 *
 * Props:
 *  - All parsed printer metadata from `parsePrinterXML` (via App.jsx)
 *  - expanded (boolean): Whether this card is expanded
 *  - onToggleExpand (function): Handler to toggle the card's expansion state
 *
 * This component is visually compact, responsive, and optimized for real-time data polling.
 */

import React, { useState } from "react";
import ComponentStreamModal from "./ComponentStreamModal";
import { getJsonJobData, formatStatusText } from "../utils/xmlUtils";
import ICONS from "../utils/iconPaths";
import { getLeftLayerTitle, getRightLayerTitle, getRightTempTitle } from "../utils/common";

const PrinterCard = ({
  printerModel,
  printerName,
  deviceStreamName,
  jobName,
  resinTemp,
  chamberTemp,
  startTime,
  timeRemaining,
  endTime,
  buildState,
  printerState,
  manualOpState,
  material,
  currentLayer,
  totalLayers,
  progress,
  jobData,
  modalDataItems,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);

  return (
    <div className={`status-card ${expanded ? "expanded-extra" : ""}`}>
      <div
        className="card-header"
        style={{ textAlign: "center", marginBottom: "10px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          {/* Left-aligned logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <img
              src={ICONS.printerLogo}
              alt="Printer Logo"
              style={{
                width: "20px",
                height: "20px",
                objectFit: "contain",
                filter: "invert(1)",
              }}
            />
          </div>

          {/* Centered printer name */}
          <div
            title="Printer Name"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: "8px",
              color: "#fefefe",
              marginLeft: "25px",
            }}
          >
            <h2 style={{ margin: 0 }}>{printerName}</h2>
          </div>

          {/* Right-aligned buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              className="icon-button"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? "Collapse Details" : "Expand Details"}
            >
              <span style={{ fontSize: "1.2em" }}>
                <img
                  src={expanded ? ICONS.collapse : ICONS.expand}
                  className="icon icon-block"
                />
              </span>
            </button>
            <button
              className="icon-button"
              onClick={() => setShowStreamModal(true)}
              title="View Detail Data"
            >
              <span
                role="img"
                aria-label="component-streams"
                style={{ fontSize: "1.2em" }}
              >
                <img src={ICONS.details} className="icon icon-block" />
              </span>
            </button>
          </div>
        </div>
        <div
          style={{
            fontSize: "0.9em",
            color: "#ccc",
            marginBottom: "4px",
            lineHeight: "1.2",
            fontWeight: "bold",
          }}
        >
          {printerModel}
        </div>
        <div className="device-stream-name" title="Device">
          {deviceStreamName}
        </div>
      </div>

      <div className="card-subtitle job-name" title="Job Name">
        {jobName}
      </div>

      <div className="status-grid">
        <div className="data-item">
          <img
            title="Resin Temperature"
            src={ICONS.resinTemp}
            className="icon icon-block"
          />
          <span className="data-value" title="Resin Temperature">
            {!isNaN(parseFloat(resinTemp))
              ? `${Math.floor(parseFloat(resinTemp) * 10000) / 10000} °C`
              : `${resinTemp}`}
          </span>
        </div>
        <div className="data-item">
          <img
            title={getRightTempTitle(deviceStreamName)}
            src={ICONS.chamberTemp}
            className="icon icon-block"
          />
          <span
            className="data-value"
            title={getRightTempTitle(deviceStreamName)}
          >
            {!isNaN(parseFloat(chamberTemp))
              ? `${Math.floor(parseFloat(chamberTemp) * 10000) / 10000} °C`
              : `${chamberTemp}`}
          </span>
        </div>
        <div className="progress-section full-span">
          <div className="layer-info">
            <img src={ICONS.layers} className="icon icon-inline" />
            <span title={getLeftLayerTitle(deviceStreamName)}>
              {currentLayer}
            </span>
            &nbsp;/&nbsp;
            <span title={getRightLayerTitle(deviceStreamName)}>
              {totalLayers}
            </span>
          </div>
          <span className="progress-percentage" title="Progress">
            {!isNaN(parseFloat(progress))
              ? `${Math.floor(parseFloat(progress) * 10) / 10} %`
              : progress}
          </span>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              title="Progress"
              style={{
                width: !isNaN(parseFloat(progress))
                  ? `${Math.floor(parseFloat(progress) * 10) / 10}%`
                  : "0%",
              }}
            ></div>
          </div>
        </div>
        <div className="data-item">
          <img
            title="Start Time"
            src={ICONS.startTime}
            className="icon icon-block"
          />
          <span className="data-value" title="Start Time">
            {startTime}
          </span>
        </div>
        <div className="data-item">
          <img
            title="Time Remaining"
            src={ICONS.timeRemaining}
            className="icon icon-block"
          />
          <span className="data-value" title="Time Remaining">
            {timeRemaining}
          </span>
        </div>
        <div className="data-item">
          <img
            title="End Time"
            src={ICONS.endTime}
            className="icon icon-block"
          />
          <span className="data-value" title="End Time">
            {endTime}
          </span>
        </div>

        <div className="data-item" style={{ alignItems: "flex-start" }}>
          <img
            title="Material"
            src={ICONS.material}
            className="icon icon-block"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              marginTop: "1px",
              flex: 1,
            }}
          >
            {Array.isArray(material) ? (
              material.map((m, i) => (
                <span
                  key={i}
                  className="data-value"
                  title={m}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                    maxWidth: "150px",
                  }}
                >
                  {m}
                </span>
              ))
            ) : (
              <span
                className="data-value"
                title={material}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "148px",
                }}
              >
                {material}
              </span>
            )}
          </div>
        </div>

        <div className="status-row-3-col">
          <div className="data-item">
            <img
              title="Printer State"
              src={ICONS.printerState}
              className="icon icon-block"
            />
            <span className="data-value" title="Printer State">
              {formatStatusText(printerState)}
            </span>
          </div>
          <div className="data-item">
            <img
              title="Build State"
              src={ICONS.buildState}
              className="icon icon-block"
            />
            <span className="data-value" title="Build State">
              {formatStatusText(buildState)}
            </span>
          </div>
          <div className="data-item">
            <img
              title="Manual Op State"
              src={ICONS.manualOpState}
              className="icon icon-block"
            />
            <span className="data-value" title="Manual Op State">
              {formatStatusText(manualOpState)}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div
          className="more-details"
          style={{
            backgroundImage: "linear-gradient(to right, #3f3f3f, #212121)",
            borderRadius: "6px",
            padding: "10px",
            marginTop: "10px",
            overflowX: "auto",
          }}
        >
          <h4
            style={{
              margin: 0,
              padding: 0,
              fontSize: "1em",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Job Data
          </h4>
          <pre className="job-data-json">
            {JSON.stringify(getJsonJobData(jobData), null, 2)}
          </pre>
        </div>
      )}

      <ComponentStreamModal
        visible={showStreamModal}
        onClose={() => setShowStreamModal(false)}
        componentStreams={modalDataItems}
        deviceStreamName={deviceStreamName}
        printerName={printerName}
        printerModel={printerModel}
      />
    </div>
  );
};

export default PrinterCard;
