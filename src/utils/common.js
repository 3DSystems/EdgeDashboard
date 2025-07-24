export const getRightTempTitle = (deviceStreamName) => {
  const match = deviceStreamName?.match(/asset_(\d+)-/);
  const model = match?.[1];
  return model === printerModelMap.SLS380
    ? "Part Bed Temperature"
    : "Chamber Temperature";
};

export const getLeftLayerTitle = (deviceStreamName) => {
  const match = deviceStreamName?.match(/asset_(\d+)-/);
  const model = match?.[1];
  return model === printerModelMap.SLS380
    ? "Current Z Height"
    : "Current Layer";
};

export const getRightLayerTitle = (deviceStreamName) => {
  const match = deviceStreamName?.match(/asset_(\d+)-/);
  const model = match?.[1];
  return model === printerModelMap.SLS380 ? "Total Z Height" : "Total Layers";
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
