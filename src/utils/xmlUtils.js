/**
 * xmlUtils.js
 *
 * Utility functions for parsing MTConnect XML into usable data structures for the frontend.
 *
 * Core Functions:
 *  - formatTimeToHHMM: Converts ISO or numeric timestamp to human-readable "HH:MM" format
 *  - getJsonJobData: Safely parses a JSON string into an object, or returns fallback value
 *  - parsePrinterXML: Converts <DeviceStream> XML nodes into structured printer objects
 *    including modalDataItems and field-based key-value extraction.
 *
 * Field Mapping:
 *  - Uses `fieldNamesByKey` from `printerFieldMappings.js` to determine which dataItemIds
 *    map to which display fields (e.g. jobName, chamberTemp, material, etc.)
 *
 * This file serves as the primary XML -> JS parser layer for MTConnect integration in the UI.
 */

import {
  singleValueFieldNamesByKey,
  multiValueFieldNamesByKey,
} from "./printerFieldMappings";
import {
  printerModelByCode,
  printerModelMap,
  printer31006StateMap,
  requiresProbeModel,
} from "./common.js";

export const formatStatusText = (text) => {
  return text?.replace(/_/g, "_\n") ?? text;
};

export const formatTimeToHHMM = (timeString) => {
  if (!timeString || timeString === "0") return timeString;

  let parsed;
  if (/^\d+$/.test(timeString)) {
    const seconds = parseInt(timeString, 10);
    if (seconds === 0) return timeString;
    parsed = new Date(seconds * 1000);
  } else {
    parsed = new Date(timeString);
  }

  return isNaN(parsed)
    ? timeString
    : parsed.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
};

export const formatSecondsToHHMM = (timeString) => {
  if (!timeString || timeString === "0") return "00:00";

  const seconds = parseInt(timeString, 10);
  if (isNaN(seconds)) {
    return timeString;
  } else if (seconds < 0) {
    return "00:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

export const formatUnderscoreText = (text) => {
  return text?.split("_").join("_\n") ?? "";
};

export const getJsonJobData = (msgValue) => {
  try {
    return msgValue ? JSON.parse(msgValue) : null;
  } catch {
    return msgValue ?? "Invalid JSON";
  }
};

export const getPrinterModelByDeviceId = (
  printerCode,
  probeModels,
  deviceStreamName
) => {
  let printerModel = "";
  if (requiresProbeModel(printerCode)) {
    const override = probeModels[deviceStreamName];
    if (override && typeof override === "string" && override.trim()) {
      printerModel = override.trim();
    }
  } else {
    printerModel = printerModelByCode[printerCode];
  }

  return printerModel;
};

// parsePrinterXML transforms MTConnect XML data into a usable array of printer objects
export const parsePrinterXML = (xmlText, opts = {}) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");
  const deviceStreams = xml.querySelectorAll("DeviceStream");
  const probeModels = opts.probeModels || {};

  return [...deviceStreams]
    .map((stream) => {
      const deviceStreamName = stream.getAttribute("name") || "Unknown Device";
      const printerCodeMatch = deviceStreamName.match(/asset_(\d+)-/);
      const printerCode = printerCodeMatch?.[1] || "Unknown";

      if (!printerModelByCode[printerCode]) return null;

      let printerModel = getPrinterModelByDeviceId(
        printerCode,
        probeModels,
        deviceStreamName
      );

      const componentStreams = [...stream.querySelectorAll("ComponentStream")];
      const modalDataItems = componentStreams.map((cs) => {
        const component = cs.getAttribute("component");
        const name = cs.getAttribute("name");

        const messages = [...cs.querySelectorAll("[dataItemId]")].map((el) => {
          const dataItemId = el.getAttribute("dataItemId");
          const key = dataItemId.split(".").slice(1).join(".");
          return {
            component,
            name,
            key,
            dataItemId,
            value: el.textContent?.trim(),
            tag: el.tagName,
            category: el.parentElement?.tagName || "Unknown",
          };
        });

        return { component, name, messages };
      });

      const flatMessages = modalDataItems.flatMap((cs) => cs.messages);
      const dataItemMap = Object.fromEntries(
        flatMessages.map((item) => [item.key, item])
      );

      // getFieldValue returns the first matching value for a given field key
      // const getFieldValue = (field) => {
      //   const validKeys = singleValueFieldNamesByKey[field] || [];
      //   for (const key of validKeys) {
      //     for (const itemKey in dataItemMap) {
      //       if (itemKey === key) return dataItemMap[itemKey].value;
      //     }
      //   }
      //   return "";
      // };

      const getFieldValue = (field) => {
        const validKeys = singleValueFieldNamesByKey[field] || [];
        for (const key of validKeys) {
          for (const itemKey in dataItemMap) {
            if (itemKey === key) return dataItemMap[itemKey].value;
          }
        }

        // Special fallback: check inside build.job_data JSON blob
        const jobDataItem = dataItemMap[singleValueFieldNamesByKey.jobData];
        if (jobDataItem?.value && jobDataItem.value.trim().startsWith("{")) {
          try {
            const jobData = JSON.parse(jobDataItem.value);
            for (const key of validKeys) {
              const nestedKey = key.replace(
                `${singleValueFieldNamesByKey.jobData}.`,
                ""
              );
              if (jobData[nestedKey] !== undefined) return jobData[nestedKey];
            }
          } catch (e) {
            console.warn("Failed to parse job_data JSON", e);
          }
        }

        return "";
      };

      // getAllFieldValues returns an array of values matching field keys
      const getAllFieldValues = (field) => {
        const validKeys = multiValueFieldNamesByKey[field] || [];
        const values = [];

        for (const key of validKeys) {
          for (const itemKey in dataItemMap) {
            if (itemKey === key) {
              values.push(dataItemMap[itemKey].value);
            }
          }
        }

        return values.length === 1 ? values[0] : values;
      };

      const resolvePrinterState = (printerCode, rawState) => {
        if (printerCode !== printerModelMap.SLS380) return rawState;
        const numeric = parseInt(rawState);
        return printer31006StateMap[numeric] || rawState;
      };

      const getCurrentLayer = () => {
        let currentLayer = getFieldValue("currentLayer");

        if (printerCode === printerModelMap.SLS380) {
          const jobDataItem =
            dataItemMap[singleValueFieldNamesByKey.jobData[0]];
          if (jobDataItem?.value && jobDataItem.value.trim().startsWith("{")) {
            try {
              const jobData = JSON.parse(jobDataItem.value);
              if (jobData.current_height !== undefined) {
                currentLayer = jobData.current_height;
              }
            } catch (err) {
              console.warn(
                "Invalid job_data while reading current_height",
                err
              );
            }
          }
        }

        return currentLayer;
      };

      const getMaterial = () => {
        let material = getAllFieldValues("material");

        if (printerCode === printerModelMap.SLS380) {
          const jobDataItem =
            dataItemMap[singleValueFieldNamesByKey.jobData[0]];
          if (jobDataItem?.value && jobDataItem.value.trim().startsWith("{")) {
            try {
              const jobData = JSON.parse(jobDataItem.value);
              if (jobData.material !== undefined) {
                material = jobData.material;
              }
            } catch (err) {
              console.warn(
                "Invalid job_data while reading current_height",
                err
              );
            }
          }
        }

        return material;
      };

      const getStartTime = () => {
        let startTimeRaw = getFieldValue("startTime");
        let startTime;

        if (
          printerCode === printerModelMap.SLA750 ||
          printerCode === printerModelMap.SLA750Dual
        ) {
          const seconds = parseInt(startTimeRaw, 10);
          if (!isNaN(seconds)) {
            const date = new Date(seconds * 1000);
            startTime = date.toISOString().substring(11, 16); // Extracts "HH:MM" from UTC
          } else {
            startTime = startTimeRaw;
          }
        } else {
          startTime = formatTimeToHHMM(startTimeRaw);
        }

        return startTime;
      };

      const getProgress = () => {
        let progress = getFieldValue("progress");

        if (
          printerCode === printerModelMap.SLA750 ||
          printerCode === printerModelMap.SLA750Dual ||
          printerCode === printerModelMap.DMPFlex350Triple
        ) {
          const val = parseFloat(progress);
          if (!isNaN(val)) {
            progress = val * 100;
          }
        }

        return progress;
      };

      const getPrinterName = () => {
        let printerName = getFieldValue("printerName");

        if (printerCode === printerModelMap.DMPFlex350Triple) {
          printerName = getFieldValue("serialNumber");
        }

        return printerName;
      };

      return {
        printerModel,
        printerName: getPrinterName(),
        deviceStreamName,
        jobName: getFieldValue("jobName"),
        resinTemp: getFieldValue("resinTemp"),
        chamberTemp: getFieldValue("chamberTemp"),
        startTime: formatTimeToHHMM(getFieldValue("startTime")),//getStartTime(),
        timeRemaining: formatSecondsToHHMM(getFieldValue("timeRemaining")),
        endTime: formatTimeToHHMM(getFieldValue("endTime")),
        buildState: getFieldValue("buildState"),
        printerState: resolvePrinterState(
          printerCode,
          getFieldValue("printerState")
        ),
        manualOpState: getFieldValue("manualOpState"),
        material: getMaterial(),
        currentLayer: getCurrentLayer(),
        totalLayers: getFieldValue("totalLayers"),
        progress: getProgress(),
        jobData: getJsonJobData(getFieldValue("jobData")),
        modalDataItems,
        dataItemMap,
      };
    })
    .filter(Boolean);
};
