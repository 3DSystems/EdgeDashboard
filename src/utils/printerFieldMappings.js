/**
 * printerFieldMappings.js
 *
 * Defines the mapping between logical UI fields (e.g. "jobName", "material") and
 * the corresponding MTConnect dataItemId keys.
 *
 * Structure:
 *   fieldNamesByKey = {
 *     fieldName: [array of possible dataItemId suffixes]
 *   }
 *
 * Example:
 *   fieldNamesByKey.material = ["mqg.material_name", "mqg.mdm_bottle_barcode"]
 *
 * Also exports:
 *   - printerModelByCode: Maps printer numeric codes to user-friendly model names
 *
 * Used primarily in xmlUtils.js for resolving raw MTConnect XML into UI-ready fields.
 */

export const singleValueFieldNamesByKey = {
  printerName: ["device.printer_name"],
  jobName: ["build.build_jobname"],
  resinTemp: ["device.resin_temperature"],
  chamberTemp: ["device.printer_chamber_temperature", "chamber_temperature"],
  startTime: ["build.start_time"],
  timeRemaining: ["build.time_remaining"],
  endTime: ["build.end_time"],
  buildState: ["device.printer_build_state"],
  printerState: ["device.printer_state"],
  manualOpState: ["device.printer_manual_op_state"],
  currentLayer: ["build.current_layer"],
  totalLayers: ["build.total_layers"],
  progress: ["build.progress"],
  jobData: ["build.job_data"],
};

export const multiValueFieldNamesByKey = {
  material: ["mqg.material_name"],
};

export const printerModelByCode = {
  30100: "PSLA 270",
  30007: "SLA 750 DUAL",
  30005: "SLA 750",
};
