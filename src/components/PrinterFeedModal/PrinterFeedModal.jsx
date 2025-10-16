import React from "react";
import ICONS from "../../utils/iconPaths";
import { HLSCameraStream } from "../HLSCameraStream/HLSCameraStream";

const PrinterFeedModal = ({ printerName, url, onClose }) => {
  return (
    // Backdrop
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)", // semi-transparent backdrop
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
      // Disable closing on backdrop click by preventing default behavior
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Body */}
      <div
        style={{
          position: "relative",
        //   width: "70vw",
          maxHeight: "80vh",
          backgroundImage: "linear-gradient(145deg, #3f3f3f, #212121)",
          color: "#cccccc",
          padding: "20px",
          borderRadius: "8px",
          overflowY: "auto",
          overflow: "hidden",
          boxShadow:
            "0 12px 24px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxSizing: "border-box",
          transition: "padding-bottom 0.5s ease-in-out",
        }}
        // Stop clicks inside modal from propagating to backdrop
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
            🖨️ {printerName} - Live Feed
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
              onClick={onClose}
              alt="Close"
              style={{ width: "24px", height: "24px", filter: "invert(1)" }}
            />
          </button>
        </div>

        {/* Live Feed */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // position: "relative",
            width: "640px",
            height: "360px",
            // maxHeight: "60vh",
            // height: "600px",
            // minWidth: "600px",
            overflow: "hidden",
            borderRadius: "4px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <HLSCameraStream url={url} height={"100%"} width={"100%"} />
        </div>
      </div>
    </div>
  );
};

export default PrinterFeedModal;
