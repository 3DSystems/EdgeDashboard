/**
 * Icon.jsx
 *
 * A reusable React component to render SVG icons throughout the application.
 * It abstracts away direct <img> tag usage and allows consistent sizing, styling, and fallback handling.
 *
 * Props:
 *  - src (string): Path to the icon file (usually from /icons via iconPaths.js)
 *  - alt (string): Alternative text for accessibility
 *  - size (number or string): Optional icon size (applies to both width and height)
 *  - className (string): Optional CSS classes for further customization
 *  - style (object): Optional inline styles for the icon
 *
 * Example:
 *   <Icon src={ICONS.thermometer} alt="Resin Temp" size={20} />
 *
 * This component ensures a unified visual layout and easy substitution of icons across the UI.
 */

import iconPaths from "../utils/iconPaths";

const Icon = ({ name, alt, className = "" }) => (
  <img src={iconPaths[name]} alt={alt || name} className={className} />
);

export default Icon;
