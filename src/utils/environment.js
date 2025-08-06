/**
 * environment.js
 *
 * This module reads and exposes environment variables defined in the `.env` file.
 * These variables are used throughout the app to configure runtime behavior.
 *
 * Environment variables must start with `REACT_APP_` to be recognized by Create React App.
 *
 * Exports:
 *  - API_POLLING_MS: Number (default 5000) - polling interval in milliseconds
 *  - MTCONNECT_HOST: String - HOST for MTConnect Agent
 *  - MTCONNECT_PORT: String - PORT for MTConnect Agent
 */

const environment = {
  MTCONNECT_HOST: process.env.REACT_APP_MTCONNECT_HOST,
  MTCONNECT_PORT: process.env.REACT_APP_MTCONNECT_PORT,
  API_POLLING_IN_MS: process.env.REACT_APP_API_POLLING_IN_MS,
  SHOW_ALL_PRINTERS: process.env.REACT_APP_SHOW_ALL_PRINTERS === "true",
};

export default environment;
