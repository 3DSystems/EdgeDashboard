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
  printerName: ["device.printer_name", "printer_name"],
  jobName: ["build.build_jobname", "build.job_data.build_filename"],
  resinTemp: ["device.resin_temperature", "vat.temperature"],
  chamberTemp: [
    "part_bed.temperature",
    "device.printer_chamber_temperature",
    "chamber_temperature",
    "chamber.temperature",
  ],
  startTime: ["build.start_time", "build.job_data.start_time"],
  timeRemaining: ["build.time_remaining", "build.job_data.time_remaining"],
  endTime: ["build.end_time", "build.job_data.completion_time"],
  buildState: ["device.printer_build_state", "build.state"],
  printerState: ["device.printer_state"],
  manualOpState: ["device.printer_manual_op_state"],
  currentLayer: [
    "build.current_layer",
    "build.job_data.current_layer",
    "build.job_data.current_height",
  ],
  totalLayers: [
    "build.total_layers",
    "build.job_data.total_layers",
    "build.job_data.total_print_height",
  ],
  progress: ["build.progress", "build.job_data.build_progress"],
  jobData: ["build.job_data"],
};

export const multiValueFieldNamesByKey = {
  material: ["mqg.material_name", "vat.material"],
};

export const printerModelByCode = {
  30100: "PSLA 270",
  30007: "SLA 750 DUAL",
  30005: "SLA 750",
  31006: "SLS 380",
  5555: "Edge PC",
};

export const printerModelMap = {
  SLA750: "30005",
  SLA750Dual: "30007",
  SLS380: "31006",
  PSLA270: "30100",
  EdgePC: "5555",
};

export const printer31006StateMap = {
  0: "Unknown",
  1: "Disconnected",
  30: "Unknown",
  31: "Idle",
  32: "Idle Error",
  33: "Shutdown",
  34: "Print Initializing",
  35: "Printing",
  36: "Print Finalizing",
  37: "Print Complete",
  38: "Print Paused",
  39: "Print Initializing Error Aborting",
  40: "Print Initializing Error Aborted",
  41: "Print Error Aborting",
  42: "Print Error Aborted",
  43: "Print Cancel Aborting",
  44: "Print Cancel Aborted",
  45: "Maintenance",
  46: "Draining",
};
