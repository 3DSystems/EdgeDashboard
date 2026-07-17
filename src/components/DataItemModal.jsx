/**
 * DataItemModal
 *
 * Lightweight modal used for Edge-PC key/value data.
 * It renders flattened data items and trims MTConnect prefixes from dataItemId
 * so values are easier to read during troubleshooting.
 */

import React from "react";
import ICONS from "../utils/iconPaths"; // Ensure this path is correct

const DataItemModal = ({ dataItems, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "70vw",
        maxHeight: "80vh",
        backgroundImage: "linear-gradient(145deg, #3f3f3f, #212121)",
        color: "#cccccc",
        padding: "20px",
        borderRadius: "8px",
        overflowY: "auto",
        boxShadow:
          "0 12px 24px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.3)",
        zIndex: 11000,
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxSizing: "border-box",
        transition: "padding-bottom 0.5s ease-in-out",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h4
          style={{
            fontSize: "1.2em",
            fontWeight: "600",
            margin: 0,
            color: "#cccccc",
            letterSpacing: "0.5px",
          }}
        >
          🧾 Edge PC - Detail Data
        </h4>

        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          title="Close"
        >
          <img
            src={ICONS.close}
            alt="Close"
            style={{ width: "24px", height: "24px", filter: "invert(1)" }}
          />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {dataItems.map(({ dataItemId, value }) => {
          // Drop the leading namespace segment (before first dot) for cleaner labels.
          const trimmedKey = dataItemId.includes(".")
            ? dataItemId.split(".").slice(1).join(".")
            : dataItemId;

          return (
            <div
              key={dataItemId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "4px",
              }}
            >
              <span>{trimmedKey}</span>
              <span style={{ color: "#cccccc" }}>{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataItemModal;
