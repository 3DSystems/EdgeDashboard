/**
 * modalUtils.js
 *
 * Utility functions related to modal state and behavior.
 * These can be used to extract, normalize, or format modal data.
 *
 * Example Use Cases:
 *  - Selecting a specific ComponentStream or message to open in a modal
 *  - Preparing or transforming message values before display
 *  - Handling modal expand/collapse logic (if separated from components)
 *
 * This file serves as a centralized place for logic that supports modal rendering
 * without bloating modal components like ComponentStreamModal.jsx or JsonModal.jsx.
 */

export const closeOnOutsideClick = (ref, callback) => {
  const handler = (e) => {
    // Fire callback only when click target is outside the modal root element.
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  document.addEventListener("mousedown", handler);
  // Return disposer so caller can remove listener on unmount.
  return () => document.removeEventListener("mousedown", handler);
};
