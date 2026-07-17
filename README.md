# 🖨️ Edge Dashboard

EdgeDashboard is a React-based web application designed to provide a comprehensive dashboard for real-time monitoring and management of printer data. It specifically leverages MTConnect XML data streamed from an MTConnect Agent, translating machine-generated information into an intuitive user interface for enhanced operational visibility and control over edge devices.

---

## 🚀 Development Setup

Follow the steps below to set up the project for local development.

### 1. **Install Node.js and npm**

Make sure you have **Node.js (v16+)** and **npm** installed.

#### On macOS or Linux:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### On Windows:
1. Download the latest LTS version from: https://nodejs.org
2. Run the installer (includes npm by default)

#### Verify installation:
```bash
node -v
npm -v
```
---

### 2. **Clone the Repository**
```bash
git clone <your-repo-url>
cd <project-directory>
```

---

### 3. **Install Dependencies**

```bash
npm install
```

---

### 4. **Set Environment Variables**
Set the MTCONNECT agent HOST and PORT in .env file

```
REACT_APP_MTCONNECT_HOST=<ip>
REACT_APP_MTCONNECT_PORT=<port>
REACT_APP_API_POLLING_IN_MS=5000
```
---

### 5. **Start the Development Server**
```bash
npm start
```

This will launch the React app at [http://localhost:3000](http://localhost:3000).

---

### 6. **Development Tips**
- Keep polling intervals reasonable (`REACT_APP_API_POLLING_IN_MS`) to avoid unnecessary load. By default its 5 second.
- Use [Prettier](https://prettier.io/) for consistent formatting.
- Commit in logical units with meaningful messages.


## Project Structure

```
src/
├── components/           # UI components like PrinterCard, ComponentStreamModal
├── utils/                # XML parsing, polling hooks, icon paths, field mappings
├── styles/               # CSS files
├── App.jsx               # Root component
├── index.js              # Entry point
public/
├── icons/                # Local SVG icon assets
├── index.html            # App root HTML
```

## Features

```
- Printer cards display real-time MTConnect metrics
- Exclusive card expansion with animated slide-down
- Modal view for complete ComponentStream data
- Inline JSON modal for parsed job data
- Auto-polling using custom `usePolling` hook
- Full dark theme with gradient styles
```

## `printerFieldMappings.js`

### Overview
- This file exports field mapping tables that tell the parser where to read values from in MTConnect data items.
- `singleValueFieldNamesByKey` maps one UI field to a list of possible source keys, checked in order.
- `multiValueFieldNamesByKey` maps one UI field to multiple source keys so all matching values can be collected.

### Runtime Behavior
- `parsePrinterXML` in `src/utils/xmlUtils.js` uses these mappings to build the printer object shown in the UI.
- For single-value fields, the parser returns the first key that exists in the configured order.
- For multi-value fields, the parser reads every configured key that exists and returns the collected values.


## `xmlUtils.js`

### Overview

[src/utils/xmlUtils.js](src/utils/xmlUtils.js) is the XML parsing and value-normalization layer for printer data.

It is used to:

1. Convert MTConnect XML into a consistent printer object used by the UI.
2. Normalize time, duration, status, and JSON fields so components can render predictable values.
3. Apply model-specific parsing rules where data format differs by printer model.

Primary runtime usage:

1. [src/App.jsx](src/App.jsx) calls parsePrinterXML after fetching XML.
2. [src/components/PrinterCard.jsx](src/components/PrinterCard.jsx) uses parsed values and formatting helpers for display.
3. [src/components/ComponentStreamModal.jsx](src/components/ComponentStreamModal.jsx) uses underscore formatting for detailed data display.

### Function Reference

| Function | Type | Purpose | Input | Output | Used In |
|---|---|---|---|---|---|
| formatStatusText | Exported | Makes underscore-separated status text easier to read in UI by adding line breaks after underscores. | text: string or null | string or original null/undefined | [src/components/PrinterCard.jsx](src/components/PrinterCard.jsx) |
| formatTimeToHHMM | Exported | Converts ISO time or epoch-seconds to HH:MM (24h). | timeString: string or number | HH:MM string, or original input when invalid | Not directly used in current UI flow |
| formatDateHHMM | Exported | Converts ISO time or epoch-seconds to M/D, HH:MM. | timeString: string or number | formatted date-time string, or original input when invalid | [src/utils/xmlUtils.js](src/utils/xmlUtils.js) return mapping |
| formatSecondsToHHMM | Exported | Converts seconds to HH:MM duration string. | timeString: string or number | HH:MM string, fallback string for invalid input | [src/utils/xmlUtils.js](src/utils/xmlUtils.js) return mapping |
| formatUnderscoreText | Exported | Splits underscore-separated text into multiple lines. | text: string | formatted string (empty string when nullish) | [src/components/ComponentStreamModal.jsx](src/components/ComponentStreamModal.jsx) |
| getJsonJobData | Exported | Safely parses JSON text; keeps fallback value when parsing fails. | msgValue: string or any | object, null, original value, or Invalid JSON text | [src/components/PrinterCard.jsx](src/components/PrinterCard.jsx), [src/utils/xmlUtils.js](src/utils/xmlUtils.js) |
| getPrinterModelByDeviceId | Exported | Resolves model name from printer code, with probe-based override for specific models. | printerCode, probeModels, deviceStreamName | model string (or empty string) | [src/utils/xmlUtils.js](src/utils/xmlUtils.js) |
| parsePrinterXML | Exported | Main XML parser. Builds final printer objects for UI cards and modals. | xmlText, opts with optional probeModels | array of normalized printer objects | [src/App.jsx](src/App.jsx) |
| getFieldValue | Internal | Returns first matching value for a single-value logical field; supports job_data JSON fallback. | field name | string or nested value | Internal to parsePrinterXML |
| getAllFieldValues | Internal | Returns all matching values for a multi-value logical field. | field name | array or single value | Internal to parsePrinterXML |
| resolvePrinterState | Internal | For SLS 380, maps numeric state values to readable text. For all other models, returns raw state unchanged. | printerCode, rawState | mapped SLS 380 state or original rawState | Internal to parsePrinterXML |
| getCurrentLayer | Internal | Gets current layer (or current_height for SLS 380 from job_data). | none | current layer value | Internal to parsePrinterXML |
| getMaterial | Internal | Gets material list, with SLS 380 job_data override if present. | none | material value or list | Internal to parsePrinterXML |
| getStartTime | Internal | Converts SLA 750 family start time from epoch-seconds to HH:MM UTC; otherwise uses formatted local date-time. | none | start time text | Internal helper currently not used in final return object |
| getProgress | Internal | For listed models, treats progress as 0-1 fraction and multiplies by 100. For other models, uses value as-is (already percent). | none | numeric or original progress value | Internal to parsePrinterXML |
| getPrinterName | Internal | Uses serial number as display name for specific model. | none | printer name string | Internal to parsePrinterXML |

## Special Cases and Behavior Notes

1. **Unknown model filtering**
- Only DeviceStream entries whose printer code exists in printerModelByCode are returned.
- Unknown codes are skipped.

2. **Field fallback from job_data JSON**
- When direct mapped keys are missing, getFieldValue can read nested values from build.job_data JSON.

3. **SLS 380 state mapping**
- For model 31006, numeric printer_state values are mapped to text using printer31006StateMap.
- For all other models, printer_state is passed through as-is.

4. **SLS 380 current layer and material overrides**
- Current layer can come from job_data.current_height.
- Material can come from job_data.material.

5. **Progress scaling by model**
- Some models publish progress as fraction (0-1). For those models, parser multiplies by 100.
- All other models are treated as already-percent values and are returned unchanged.

6. **Model-specific printer name override**
- For DMP Flex 350 Triple, serial number is used as display printer name.

7. **Time parsing supports two formats**
- Time helpers support both ISO date strings and epoch-seconds.

8. **Duration rounding behavior**
- formatSecondsToHHMM rounds minute remainder upward using ceiling.
- Example: 59 seconds becomes 00:01.

9. **Unused internal helper**
- getStartTime is defined inside parsePrinterXML.
- The final returned startTime currently uses formatDateHHMM(getFieldValue("startTime")) directly.