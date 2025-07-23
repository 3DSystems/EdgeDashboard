import { printerModelMap } from "../utils/printerFieldMappings";

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
  return model === printerModelMap.SLS380
    ? "Total Z Height"
    : "Total Layers";
};
