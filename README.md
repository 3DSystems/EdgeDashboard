# React Printer Monitoring App

This application displays the status of multiple 3D printers using data from an MTConnect Agent. It visualizes build state, temperatures, material info, and job progress using cards and modals.

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

## Environment Variables

Set the MTCONNECT agent HOST and PORT in .env file

```
REACT_APP_MTCONNECT_HOST=http://<ip>
REACT_APP_MTCONNECT_PORT=<port>
REACT_APP_API_POLLING_IN_SEC=5000
```

## Available Scripts

- `npm install` – Install dependencies
- `npm start` – Start development server at http://localhost:3000
- `npm run build` – Create optimized production build

## Features

- Printer cards display real-time MTConnect metrics
- Exclusive card expansion with animated slide-down
- Modal view for complete ComponentStream data
- Inline JSON modal for parsed job data
- Auto-polling using custom `usePolling` hook
- Full dark theme with gradient styles
