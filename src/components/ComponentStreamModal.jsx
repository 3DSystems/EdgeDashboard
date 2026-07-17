/**
 * ComponentStreamModal.jsx
 *
 * This modal component displays a detailed breakdown of ComponentStream messages
 * for a selected printer device. It's shown when the user clicks the "View Details" icon
 * on a <PrinterCard />.
 *
 * Features:
 *  - Renders all ComponentStream sections in a scrollable, grid-like layout.
 *  - Displays each component's messages in a formatted table with key-value rows.
 *  - Supports collapsing/expanding each component block individually.
 *  - Includes a global "Expand All / Collapse All" toggle at the top.
 *  - Supports parsing and displaying jobData JSON in a formatted <pre> block.
 *  - Responsive design with fixed width and internal scroll handling.
 *
 * Props:
 *  - visible (boolean): Controls modal visibility
 *  - onClose (function): Closes the modal
 *  - componentStreams (array): Array of parsed ComponentStream sections
 *  - deviceStreamName (string): Name of the parent DeviceStream
 *  - printerName (string): Human-readable name of the printer
 *  - printerModel (string): Model description based on printer code
 *
 * This component helps users inspect raw MTConnect ComponentStream data in a
 * structured and user-friendly format, making it ideal for diagnostics and analysis.
 */

import React, { useRef, useEffect, useState, useMemo } from "react";
import { closeOnOutsideClick } from "../utils/modalUtils";
import { singleValueFieldNamesByKey } from "../utils/printerFieldMappings";
import ICONS from "../utils/iconPaths";
import { formatUnderscoreText } from "../utils/xmlUtils";

const ComponentStreamModal = ({
  visible,
  onClose,
  componentStreams,
  deviceStreamName,
  printerName,
  printerModel,
}) => {
  const [expandedCards, setExpandedCards] = useState({});
  // Stores the selected message source used to open the nested JSON modal.
  const [jsonSource, setJsonSource] = useState({
    component: null,
    message: null,
  });

  const modalRef = useRef();

  useEffect(() => {
    const cleanup = closeOnOutsideClick(modalRef, onClose);
    return cleanup;
  }, [onClose]);

  const toggleCard = (index) => {
    setExpandedCards((prev) => {
      const updated = { ...prev };
      updated[index] = !prev[index];
      return updated;
    });
  };

  const handleOpenJson = (component, message) => {
    setJsonSource({ component, message });
  };

  const handleCloseJson = () => {
    setJsonSource({ component: null, message: null });
  };

  const jsonModalData = useMemo(() => {
    if (!jsonSource.component || !jsonSource.message) return null;

    // jobData may exist in any component stream, so scan all streams and pick first valid value.
    for (const stream of componentStreams) {
      const match = stream.messages?.find(
        (m) => m.key === singleValueFieldNamesByKey?.jobData[0] && m.value,
      );
      if (match) {
        try {
          return JSON.parse(match.value);
        } catch {
          return match.value ?? "Invalid JSON";
        }
      }
    }

    return null;
  }, [componentStreams, jsonSource]);

  if (!visible) return null;

  const allExpanded =
    Object.values(expandedCards).filter(Boolean)?.length ===
    componentStreams?.length;

  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedCards({});
    } else {
      // Use index-keyed map to track expanded state per card for O(1) toggles.
      const all = {};
      componentStreams.forEach((_, i) => (all[i] = true));
      setExpandedCards(all);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90vw",
          height: "90vh",
          backgroundColor: "#2b2b2b",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          overflowY: "auto",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
          zIndex: 10000,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h3 style={{ margin: 0 }}>
            {printerName} ({printerModel} : {deviceStreamName}){" -"}
            <span
              style={{
                fontWeight: "normal",
                fontSize: "0.9em",
                color: "#ccc",
                marginLeft: "10px",
              }}
            >
              Detail Data
            </span>
          </h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleToggleAll}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              title={allExpanded ? "Collapse All" : "Expand All"}
            >
              <img
                src={allExpanded ? ICONS.collapseAll : ICONS.expandAll}
                alt={allExpanded ? "Collapse All" : "Expand All"}
                style={{ width: "24px", height: "24px", filter: "invert(1)" }}
              />
            </button>
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
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: "16px",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          {componentStreams.map((cs, index) => {
            const isExpanded = Boolean(expandedCards[index]);
            // Prefer component title when name contains asset identifier to keep header readable.
            const cardTitle =
              (cs.name && cs.name.includes("asset_") && cs.component) ||
              cs.name;
            const isTitleFromDataItemId = cardTitle === cs.name;

            return (
              <div
                key={index}
                style={{
                  backgroundImage: "linear-gradient(145deg, #3f3f3f, #212121)",
                  border: "1px solid #555",
                  borderRadius: "8px",
                  padding: "10px",
                  width: "400px",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow:
                    "0 12px 24px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.2),inset 0 1px 1px rgba(255, 255, 255, 0.1),inset 0 -1px 1px rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  boxSizing: "border-box",
                  transition: "padding-bottom 0.5s ease-in-out",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    paddingBottom: "6px",
                    marginBottom: "8px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      textAlign: "center",
                      flex: 1,
                      color: "#fff",
                    }}
                  >
                    {cardTitle}
                  </h4>

                  <button
                    className="icon-button"
                    onClick={() => toggleCard(index)}
                    title={isExpanded ? "Collapse" : "Expand"}
                    style={{
                      fontSize: "1.2em",
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    <img
                      src={isExpanded ? ICONS.collapse : ICONS.expand}
                      alt={isExpanded ? "Collapse" : "Expand"}
                      style={{
                        width: "20px",
                        height: "20px",
                        filter: "invert(1)",
                      }}
                    />
                  </button>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      transition: "all 0.3s ease",
                      backgroundImage:
                        "linear-gradient(145deg, #3f3f3f, #212121)",
                      borderRadius: "6px",
                      boxSizing: "border-box",
                      boxShadow:
                        "0 12px 24px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.2),inset 0 1px 1px rgba(255, 255, 255, 0.1),inset 0 -1px 1px rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "padding-bottom 0.5s ease-in-out",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "transparent",
                        minWidth: "300px",
                      }}
                    >
                      <tbody>
                        {cs.messages.map((msg, i) => (
                          <tr key={i}>
                            <td
                              style={{
                                padding: "6px",
                                borderBottom: "1px solid #444",
                                color: "#ccc",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                width: "55%",
                                ...(!isTitleFromDataItemId && {
                                  width: "60%",
                                }),
                              }}
                            >
                              {
                                msg.dataItemId
                                  ? msg.dataItemId.indexOf(".") > -1 // Check if a dot exists
                                    ? msg.dataItemId.slice(
                                        msg.dataItemId.indexOf(".") + 1,
                                      ) // Get everything AFTER the first dot
                                    : msg.dataItemId // No dot found, so just use the whole string
                                  : msg.name // No dataItemId, so fall back to name
                              }
                            </td>
                            <td
                              style={{
                                padding: "6px",
                                borderBottom: "1px solid #444",
                                color: "#ccc",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                textAlign: "right",
                              }}
                            >
                              {singleValueFieldNamesByKey?.jobData?.includes(
                                msg.key,
                              ) ? (
                                <button
                                  onClick={() =>
                                    handleOpenJson(msg.key, msg.value)
                                  }
                                  style={{
                                    padding: "4px 10px",
                                    background: "gray",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.9em",
                                  }}
                                >
                                  View JSON
                                </button>
                              ) : (
                                formatUnderscoreText(msg.value)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Build Job Data Modal */}
      {jsonModalData && (
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
              "0 12px 24px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.2),inset 0 1px 1px rgba(255, 255, 255, 0.1),inset 0 -1px 1px rgba(0, 0, 0, 0.3)",
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
              🧾 Build Job Data
            </h4>

            <button
              onClick={handleCloseJson}
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

          <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9em" }}>
            {typeof jsonModalData === "string"
              ? jsonModalData
              : JSON.stringify(jsonModalData, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default ComponentStreamModal;
