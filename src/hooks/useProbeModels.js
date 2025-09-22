"use client";

import { useEffect, useState } from "react";
import { fetchProbeOnce } from "../utils/probe";

export function useProbeModels() {
  const [models, setModels] = useState({});
  useEffect(() => {
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
