# 🚀 React App Deployment on Linux with Nginx & MTConnect API Proxy

This guide walks you through deploying a React app on a Linux server using **Nginx**, with reverse proxy to a **MTConnect API at localhost:5000**, including CORS and fallback handling.

---

## ✅ Prerequisites

- Linux machine (Debian/Ubuntu recommended)
- React app source code
- MTConnect API running at `http://localhost:5000`
- Port `3000` must be free for Nginx to serve the UI

---

## 🛠 Step-by-Step Setup

### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

---

### 2. Build the React App

```bash
cd /path/to/react-app
npm install
npm run build
```

---

### 3. Deploy Build to Web Server Root

```bash
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/
```

---

### 4. Create the Nginx Site Config

```bash
sudo nano /etc/nginx/sites-available/react-app
```

Paste the following:

```nginx
server {
    listen 3000;
    server_name localhost;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /mtconnect/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "*";

        proxy_connect_timeout 2;
        proxy_read_timeout 5;
        error_page 502 504 500 = /custom-503.html;
    }
}
```

---

### 5. Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 6. Add Fallback Page

```bash
echo "<html><body><h1>MTConnect API is currently unavailable.</h1></body></html>" | sudo tee /var/www/html/custom-503.html
```

---

### 7. Open the UI

Visit: [http://localhost:3000](http://localhost:3000)

Your React app should load, and requests to `/mtconnect/...` will proxy to `localhost:5000`.

If the API is down, `custom-503.html` will be served.

---

## ✅ Done!
