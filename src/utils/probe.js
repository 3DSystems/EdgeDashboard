/**
 * probe.js
 *
 * Utilities for fetching and parsing MTConnect /probe XML into:
 * { [deviceName]: model }
 *
 * fetchProbeOnce() memoizes the network request for initial app load.
 * fetchProbe() always performs a fresh request for recovery/fallback scenarios.
 */

// Fetches /probe exactly once per page load and returns { [deviceName]: model }
let probePromise = null;

function first(list) {
  return list && list.length ? list[0] : undefined;
}
function byLocalName(root, localName) {
  const all = root.getElementsByTagNameNS("*", localName);
  return Array.from(all);
}
function parseProbeXmlToMap(xml) {
  const map = {};
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const parserError = doc.getElementsByTagName("parsererror");
  if (parserError && parserError.length) {
    console.warn(
      "[probe] XML parser error:",
      parserError[0]?.textContent || "",
    );
    return map;
  }
  const devices = byLocalName(doc, "Device");
  for (const dev of devices) {
    const name = dev.getAttribute("name") || "";
    if (!name) continue;
    // Probe model is sourced from <Description model="..."> when available.
    const description = first(dev.getElementsByTagNameNS("*", "Description"));
    const modelAttr = description?.getAttribute("model") || "";
    if (modelAttr) map[name] = modelAttr.trim();
  }
  return map;
}

export function fetchProbeOnce() {
  if (!probePromise) {
    // Memoize initial request to avoid duplicate /probe calls across subscribers.
    probePromise = fetch(`/mtconnect/probe?_=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then(async (r) => {
        if (!r.ok)
          throw new Error(`/probe failed: ${r.status} ${r.statusText}`);
        const text = await r.text();
        return parseProbeXmlToMap(text);
      })
      .catch((err) => {
        console.error("[probe] fetch failed:", err);
        return {}; // fail-safe
      });
  }
  return probePromise;
}

export function fetchProbe() {
  // Non-memoized variant used when a fresh probe read is explicitly required.
  return fetch(`/mtconnect/probe?_=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  })
    .then(async (r) => {
      if (!r.ok) throw new Error(`/probe failed: ${r.status} ${r.statusText}`);
      const text = await r.text();
      return parseProbeXmlToMap(text);
    })
    .catch((err) => {
      console.error("[probe] fetch failed:", err);
      return {}; // fail-safe
    });
}
