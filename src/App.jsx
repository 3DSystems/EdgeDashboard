/**
 * App.jsx
 *
 * Root component that:
 *  - Fetches MTConnect XML and builds printer objects
 *  - Polls periodically
 *  - Renders either:
 *      a) existing PrinterCard grid (default), OR
 *      b) new compact /newui page using renamed fields
 */

import React, { useEffect, useRef, useState } from "react";
import { usePolling } from "./utils/usePolling";
import PrinterCard from "./components/PrinterCard";
import { parsePrinterXML } from "./utils/xmlUtils";
import environment from "./utils/environment";
import DataItemModal from "./components/DataItemModal";
import { printerModelMap } from "./utils/common.js";
import { useProbeModels } from "./hooks/useProbeModels";
import { fetchProbe } from "./utils/probe";

// NEW: import the new page that shows compact cards
import NewUIPage from "./components/NewUIPage";

const App = () => {
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const model5555Printer = printers.find((p) => {
    const match = p.deviceStreamName?.match(/asset_(\d+)-/);
    return match?.[1] === printerModelMap.EdgePC;
  });

  const probeModels = useProbeModels();
  const [probeModelsAll, setProbleModelsAll] = useState();
  const hasApiFailed = useRef(false);

  useEffect(() => {
    setProbleModelsAll(probeModels);
  }, [probeModels]);

  const fetchFallbackProbeModels = async () => {
    try {
      const models = await fetchProbe();
      setProbleModelsAll(models);
      console.log("Fetched fallback probe models");
    } catch (error) {
      console.error("Failed to fetch fallback probe models", error);
    }
  };

  const fetchData = async () => {
    try {
      setHasError(false);
      const response = await fetch(`/mtconnect/current?_=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (response.ok) {
        const xmlText = await response.text();
        const parsedPrinters = parsePrinterXML(xmlText, {
          probeModels: probeModelsAll,
        });
        setPrinters(parsedPrinters);

        if (hasApiFailed.current) {
          console.log("Fetch succeeded after failure — calling fallback");
          await fetchFallbackProbeModels();
          hasApiFailed.current = false;
        }
      } else {
        console.warn("Fetch failed with status", response.status);
        hasApiFailed.current = true;
      }
    } catch (err) {
      console.error("Failed to fetch or parse XML", err);
      setHasError(true);
      hasApiFailed.current = true;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  usePolling(fetchData, environment.API_POLLING_IN_MS);

  // ---- Route switch (no router needed) ----
  const isNewUI =
    typeof window !== "undefined" && window.location.pathname === "/v2";

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

  // ------ /newui compact page ------
  if (isNewUI) {
    return <NewUIPage printers={printers} />;
  }

  // ------ default (existing) layout ------
  return (
    <>
      {model5555Printer && (
        <div
          style={{
            position: "sticky",
            top: 0,
            display: "flex",
            justifyContent: "flex-end",
            padding: "18px",
            zIndex: 999,
          }}
        >
          <button
            onClick={() => setShowModal(true)}
            style={{
              position: "fixed",
              top: 10,
              right: 10,
              padding: "8px 12px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            Show Edge-PC Data
          </button>
        </div>
      )}

      {showModal && (
        <DataItemModal
          onClose={() => setShowModal(false)}
          dataItems={model5555Printer.modalDataItems.flatMap((c) =>
            c.messages.map((m) => ({
              dataItemId: m.dataItemId,
              value: m.value,
            }))
          )}
        />
      )}

      <div id="cardsContainer">
        {printers
          .filter((p) => {
            const match = p.deviceStreamName?.match(/asset_(\d+)-/);
            return match?.[1] !== printerModelMap.EdgePC;
          })
          .map((data) => {
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
    </>
  );
};

export default App;
