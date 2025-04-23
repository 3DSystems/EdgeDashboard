/**
 * iconPaths.js
 *
 * Centralized icon path configuration.
 * Each key maps to a locally hosted SVG icon in the `/public/icons/` directory.
 * This ensures all icons are bundled with the app and not fetched from a CDN.
 *
 * Example:
 *   ICONS.resinTemp => "/icons/thermometer.svg"
 *
 * These icons are used across the UI for printer metrics, status indicators, buttons, etc.
 */

const ICONS = {
  printerLogo: "/icons/ddd-logo.svg",
  expand: "/icons/chevron-down.svg",
  collapse: "/icons/chevron-up.svg",
  expandAll: "/icons/chevrons-down.svg",
  collapseAll: "/icons/chevrons-up.svg",
  details: "/icons/rows-4.svg",
  resinTemp: "/icons/thermometer.svg",
  chamberTemp: "/icons/package.svg",
  layers: "/icons/layers.svg",
  startTime: "/icons/play-circle.svg",
  timeRemaining: "/icons/hourglass.svg",
  endTime: "/icons/flag.svg",
  material: "/icons/flask-conical.svg",
  printerState: "/icons/printer.svg",
  buildState: "/icons/loader.svg",
  manualOpState: "/icons/switch-camera.svg",
  close: "/icons/x.svg",
};

export default ICONS;
