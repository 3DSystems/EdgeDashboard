/**
 * JsonModal.jsx
 *
 * This component renders a modal window that displays a JSON object (such as `jobData`)
 * in a formatted, syntax-highlighted `<pre>` block for better readability.
 *
 * Features:
 *  - Renders formatted JSON data with indentation
 *  - Provides a simple modal overlay with dark theme
 *  - Includes a close button to dismiss the modal
 *
 * Props:
 *  - visible (boolean): Controls visibility of the modal
 *  - onClose (function): Closes the modal when invoked
 *  - jsonData (object or string): The JSON data to display
 *  - title (string): Title shown at the top of the modal
 *
 * This component is lightweight and reusable wherever formatted JSON needs to be shown in a popup.
 */

import React, { useRef, useEffect } from "react";
import { closeOnOutsideClick } from "../utils/modalUtils";

const modalRef = useRef();

useEffect(() => {
  setExpandedCards({});
}, [jsonData]);

useEffect(() => {
  const cleanup = closeOnOutsideClick(modalRef, onClose);
  return cleanup;
}, []);

const JsonModal = ({ visible, data, onClose }) => {
  if (!visible) return null;

  return (
    <div className="json-modal">
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <h3>Build Job Data</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default JsonModal;
