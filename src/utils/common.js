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
  60000: "PostCure 1050",
  32009: "DMP Flex 350 Triple",
  34502: "Figure4 135",
  20003: "NextDent 300",
  20004: "MJP 300W",
  20005: "MJP 300W Plus",
  30008: "SLA 825",
};

export const printerModelMap = {
  SLA750: "30005",
  SLA750Dual: "30007",
  SLS380: "31006",
  PSLA270: "30100",
  EdgePC: "5555",
  PostCure1050: "60000",
  DMPFlex350Triple: "32009",
  Figure4_135: "34502",
  NextDent300: "20003",
  MJP300W: "20004",
  MJP300WPlus: "20005",
  SLA825: "30008",
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
