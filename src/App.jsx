/**
 * App.jsx
 *
 * This is the root React component of the application.
 * It is responsible for:
 *  - Fetching MTConnect XML data and converting it into usable printer objects.
 *  - Managing global UI state (loading, error, expanded card).
 *  - Polling the backend periodically for updates using a custom polling hook.
 *  - Rendering a list of <PrinterCard /> components, one for each device.
 *  - Showing a loading spinner, error message, or fallback text depending on the app state.
 *
 * Core Dependencies:
 *  - parsePrinterXML: Parses MTConnect XML into structured data.
 *  - usePolling: Custom hook for auto-refreshing the data.
 *  - environment.js: Reads config like polling interval and agent host.
 *
 * This component serves as the control center of the UI.
 */

import React, { useEffect, useState } from "react";
import { usePolling } from "./utils/usePolling";
import PrinterCard from "./components/PrinterCard";
import { parsePrinterXML } from "./utils/xmlUtils";
import environment from "./utils/environment";

const App = () => {
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchData = async () => {
    try {
      setHasError(false);
      const response = await fetch(`/mtconnect/current`);
      const xmlText = await response.text();
      const parsedPrinters = parsePrinterXML(xmlText);
      setPrinters(parsedPrinters);
    } catch (err) {
      console.error("Failed to fetch or parse XML", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  usePolling(fetchData, environment.API_POLLING_IN_MS);

  if (isLoading) {
    return (
      <div
        className="loading-container"
        style={{
          background: "#2b2b2b",
          color: "#fefefe",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "95vh",
          flexDirection: "column",
        }}
      >
        <div
          className="spinner"
          style={{
            border: "6px solid #444",
            borderTop: "6px solid #fefefe",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p style={{ marginTop: "12px" }}>Loading Printers</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className="loading-container"
        style={{
          background: "#2b2b2b",
          color: "#fefefe",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "95vh",
          flexDirection: "column",
        }}
      >
        <p style={{ fontSize: "18px" }}>Failed to load printers</p>
      </div>
    );
  }

  if (printers.length === 0) {
    return (
      <div
        className="loading-container"
        style={{
          background: "#2b2b2b",
          color: "#fefefe",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "95vh",
          flexDirection: "column",
        }}
      >
        <p style={{ fontSize: "18px" }}>No printer found</p>
      </div>
    );
  }

  return (
    <div id="cardsContainer">
      {printers.map((data) => {
        const id = data.deviceStreamName;
        return (
          <PrinterCard
            key={id}
            {...data}
            expanded={expandedCardId === id}
            onToggleExpand={() =>
              setExpandedCardId(expandedCardId === id ? null : id)
            }
          />
        );
      })}
    </div>
  );
};

export default App;
