# 🖨️ Edge Dashboard

This application displays the real-time status of Printers using MTConnect XML data.

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