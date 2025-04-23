/**
 * usePolling.js
 *
 * Custom React hook that enables periodic execution of a given function
 * (typically used to fetch updated printer data).
 *
 * Usage:
 *   usePolling(fetchData, 5000); // fetchData runs every 5 seconds
 *
 * Parameters:
 *   - callback (function): The function to invoke at each interval
 *   - delay (number): Polling interval in milliseconds
 *
 * Behavior:
 *   - Automatically sets up and tears down the interval on mount/unmount
 *   - Prevents stale intervals using `clearInterval`
 *
 * This hook is designed for use in App.jsx to refresh the MTConnect printer data on a fixed schedule.
 */

import { useEffect } from "react";

export const usePolling = (callback, delay) => {
  useEffect(() => {
    const interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [callback, delay]);
};
