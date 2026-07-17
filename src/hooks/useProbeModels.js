"use client";

/**
 * useProbeModels()
 *
 * Fetches probe model metadata once and exposes it as a device-name keyed map.
 * This keeps model resolution logic in App/xml parser simple and cache-friendly.
 */

import { useEffect, useState } from "react";
import { fetchProbeOnce } from "../utils/probe";

export function useProbeModels() {
  const [models, setModels] = useState({});
  useEffect(() => {
    // Guard against setState on unmounted component if fetch resolves late.
    let mounted = true;
    fetchProbeOnce().then((m) => {
      if (mounted) setModels(m);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return models; // { [deviceName]: model }
}
