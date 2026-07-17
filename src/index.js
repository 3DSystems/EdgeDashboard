/**
 * index.js
 *
 * Entry point of the React application.
 * This file is responsible for rendering the root App component into the DOM.
 * It attaches React to the root HTML element in public/index.html.
 * React StrictMode is used to highlight potential issues in development.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/printer.css"; // Global stylesheet for the application

// Create the root React container and render the App component into it
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the application wrapped in StrictMode for highlighting potential issues
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
