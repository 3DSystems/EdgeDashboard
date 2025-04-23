# 🖨️ 3D Printer Monitoring Dashboard

Monitoring dashboard that displays the real-time status of 3D printers using MTConnect XML data.

---

## 🚀 Development Setup

Follow the steps below to set up the project for local development.

### 1. **Clone the Repository**
```bash
git clone <your-repo-url>
cd <project-directory>
```

---

### 2. **Install Dependencies**
Make sure you have **Node.js (v16+)** and **npm** installed.

```bash
npm install
```

---

### 3. **Set Environment Variables**
Set the MTCONNECT agent HOST and PORT in .env file

```
REACT_APP_MTCONNECT_HOST=<ip>
REACT_APP_MTCONNECT_PORT=<port>
REACT_APP_API_POLLING_IN_SEC=5000
```

### 4. **Start the Development Server**
```bash
npm start
```

This will launch the React app at [http://localhost:3000](http://localhost:3000).

---

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

- Printer cards display real-time MTConnect metrics
- Exclusive card expansion with animated slide-down
- Modal view for complete ComponentStream data
- Inline JSON modal for parsed job data
- Auto-polling using custom `usePolling` hook
- Full dark theme with gradient styles
