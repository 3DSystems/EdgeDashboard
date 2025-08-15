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
    "chamber.chamber_temp",
  ],
  startTime: ["build.start_time", "build.job_data.start_time"],
  timeRemaining: ["build.time_remaining", "build.job_data.time_remaining"],
  endTime: ["build.end_time", "build.job_data.completion_time"],
  buildState: ["device.printer_build_state", "build.state"],
  printerState: ["device.printer_state", "printer_state", "system_state"],
  manualOpState: ["device.printer_manual_op_state"],
  currentLayer: [
    "build.job_data.current_height",
    "build.current_layer",
    "build.job_data.current_layer",
  ],
  totalLayers: [
    "build.job_data.total_print_height",
    "build.total_layers",
    "build.job_data.total_layers",
  ],
  progress: ["build.progress", "build.job_data.build_progress"],
  jobData: ["build.job_data"],
};

export const multiValueFieldNamesByKey = {
  material: ["mqg.material_name", "vat.material", "build.job_data.material"],
};
