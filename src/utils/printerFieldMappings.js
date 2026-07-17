/**
 * Defines which MTConnect data item keys map to each UI field.
 *
 * Exports:
 * - singleValueFieldNamesByKey:
 *   Maps one UI field to an ordered list of possible keys.
 *   The parser uses the first key that exists and has a value.
 *
 * - multiValueFieldNamesByKey:
 *   Maps one UI field to multiple keys.
 *   The parser collects values from all matching keys.
 *
 * This mapping is used by parsePrinterXML in src/utils/xmlUtils.js.
 */

export const singleValueFieldNamesByKey = {
  printerName: ["device.printer_name", "printer_name"],
  jobName: [
    "build.build_jobname",
    "build.build_job_name",
    "build.job_data.build_filename",
  ],
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
  serialNumber: ["serial_number"],
};

export const multiValueFieldNamesByKey = {
  material: ["mqg.material_name", "vat.material","stock.material_name", "build.job_data.material"],
};
