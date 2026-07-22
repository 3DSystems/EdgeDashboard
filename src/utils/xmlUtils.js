/**
 * XML utility helpers for Edge Dashboard.
 *
 * Responsibilities:
 * - Parse MTConnect DeviceStream XML into normalized printer objects.
 * - Resolve field values using configured key mappings.
 * - Normalize status, date/time, duration, and JSON values for UI rendering.
 * - Apply model-specific parsing rules where data payloads differ.
 *
 * Main entry point: parsePrinterXML(xmlText, opts).
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

/**
 * formatStatusText(text)
 * Replaces underscores with underscore + newline for multi-line status labels.
 */
export const formatStatusText = (text) => {
  return text?.replace(/_/g, "_\n") ?? text;
};

/**
 * formatTimeToHHMM(timeString)
 * Converts ISO time or epoch-seconds into HH:MM (24-hour).
 * Returns original input when empty, zero, or invalid.
 */
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

/**
 * formatDateHHMM(timeString)
 * Converts ISO time or epoch-seconds into M/D, HH:MM.
 * Returns original input when empty, zero, or invalid.
 */
export const formatDateHHMM = (timeString) => {
  if (!timeString || timeString === "0") return timeString;

  let date;

  if (/^\d+$/.test(timeString.toString())) {
    const seconds = parseInt(timeString.toString(), 10);
    if (seconds === 0) return timeString;
    date = new Date(seconds * 1000);
  } else {
    date = new Date(timeString);
  }

  if (isNaN(date.getTime())) return timeString;

  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${month}/${day}, ${hours}:${minutes}`;
};

/**
 * formatSecondsToHHMM(timeString)
 * Converts duration in seconds into HH:MM.
 * Returns 00:00 for empty/zero/negative input.
 * Returns original input when value cannot be parsed as a number.
 */
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
    "0",
  )}`;
};

/**
 * formatUnderscoreText(text)
 * Splits underscore-separated text with line breaks.
 * Returns empty string for null/undefined input.
 */
export const formatUnderscoreText = (text) => {
  return text?.split("_").join("_\n") ?? "";
};

/**
 * getJsonJobData(msgValue)
 * Safely parses JSON text and returns parsed object.
 * Returns null for empty input.
 * Returns original value (or Invalid JSON) if parsing fails.
 */
export const getJsonJobData = (msgValue) => {
  try {
    return msgValue ? JSON.parse(msgValue) : null;
  } catch {
    return msgValue ?? "Invalid JSON";
  }
};

/**
 * getPrinterModelByDeviceId(printerCode, probeModels, deviceStreamName)
 * Resolves printer model display name.
 * For probe-driven models, uses probeModels override by DeviceStream name.
 * For other models, uses static printer code mapping.
 */
export const getPrinterModelByDeviceId = (
  printerCode,
  probeModels,
  deviceStreamName,
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

/**
 * parsePrinterXML(xmlText, opts)
 * Parses MTConnect XML and returns normalized printer objects for the dashboard.
 * Each object includes UI fields, raw modal data, and a key-addressable dataItem map.
 */
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
        deviceStreamName,
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
        flatMessages.map((item) => [item.key, item]),
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

      /**
       * getFieldValue(field)
       * Returns the first matching value for a logical field from single-value mappings.
       * Also supports fallback lookup from build.job_data JSON when available.
       */
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
                "",
              );
              if (jobData[nestedKey] !== undefined) return jobData[nestedKey];
            }
          } catch (e) {
            console.warn("Failed to parse job_data JSON", e);
          }
        }

        return "";
      };

      /**
       * getAllFieldValues(field)
       * Returns all matching values for a logical field from multi-value mappings.
       * Returns a single value when only one match is found.
       */
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

      /**
       * resolvePrinterState(printerCode, rawState)
       * For SLS 380, maps numeric state codes to readable state text.
       * For non-SLS 380 models, returns rawState unchanged.
       */
      const resolvePrinterState = (printerCode, rawState) => {
        if (printerCode !== printerModelMap.SLS380) return rawState;
        const numeric = parseInt(rawState);
        return printer31006StateMap[numeric] || rawState;
      };

      /**
       * getCurrentLayer()
       * Resolves current layer value, including SLS 380 current_height override from job_data.
       */
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
                err,
              );
            }
          }
        }

        return currentLayer;
      };

      /**
       * getMaterial()
       * Resolves material value(s), including SLS 380 material override from job_data.
       */
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
                err,
              );
            }
          }
        }

        return material;
      };

      /**
       * getStartTime()
       * Converts start time with SLA 750-family specific rules.
       * Note: currently defined but not used in final return mapping.
       */
      const getStartTime = () => {
        let startTimeRaw = getFieldValue("startTime");
        let startTime;

        if (
          printerCode === printerModelMap.SLA750 ||
          printerCode === printerModelMap.SLA750Dual ||
          printerCode === printerModelMap.SLA750DualPro ||
          printerCode === printerModelMap.SLA750Pro
        ) {
          const seconds = parseInt(startTimeRaw, 10);
          if (!isNaN(seconds)) {
            const date = new Date(seconds * 1000);
            startTime = date.toISOString().substring(11, 16); // Extracts "HH:MM" from UTC
          } else {
            startTime = startTimeRaw;
          }
        } else {
          startTime = formatDateHHMM(startTimeRaw);
        }

        return startTime;
      };

      /**
       * getProgress()
       * For listed models, converts 0-1 fractional progress to percent.
       * For non-listed models, returns progress as-is.
       */
      const getProgress = () => {
        let progress = getFieldValue("progress");

        if (
          printerCode === printerModelMap.SLA750 ||
          printerCode === printerModelMap.SLA750Dual ||
          printerCode === printerModelMap.SLA750DualPro ||
          printerCode === printerModelMap.SLA750Pro ||
          printerCode === printerModelMap.DMPFlex350Triple ||
          printerCode === printerModelMap.DMPFactory350 ||
          printerCode === printerModelMap.DMPFactory350Dual ||
          printerCode === printerModelMap.DMPFactory500 ||
          printerCode === printerModelMap.DMPFlex350 ||
          printerCode === printerModelMap.DMPFlex350Dual ||
          printerCode === printerModelMap.DMPFlex350Triple ||
          printerCode === printerModelMap.SLA825
        ) {
          const val = parseFloat(progress);
          if (!isNaN(val)) {
            progress = val * 100;
          }
        }

        return progress;
      };

      /**
       * getPrinterName()
       * Uses serial number as display name for DMP Flex 350 Triple.
       */
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
        startTime: formatDateHHMM(getFieldValue("startTime")),
        timeRemaining: formatSecondsToHHMM(getFieldValue("timeRemaining")),
        endTime: formatDateHHMM(getFieldValue("endTime")),
        buildState: getFieldValue("buildState"),
        printerState: resolvePrinterState(
          printerCode,
          getFieldValue("printerState"),
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
