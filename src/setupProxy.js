/**
 * setupProxy.js
 *
 * This file is used to configure a development-time proxy for the React development server.
 * It allows the frontend (running on http://localhost:3000) to make API requests to a different
 * server (like MTConnect Agent) without running into CORS issues.
 *
 * The proxy intercepts requests starting with a specific path (e.g. `/mtconnect`) and forwards them
 * to the MTConnect Agent host defined in the .env file (`REACT_APP_MTCONNECT_HOST`).
 *
 * This only runs in development mode (when using `npm start`), and has no effect in production builds.
 */

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const host = process.env.REACT_APP_MTCONNECT_HOST || "localhost";
  const port = process.env.REACT_APP_MTCONNECT_PORT || "5000";
  const target = `http://${host}:${port}`;

  app.use(
    "/mtconnect",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { "^/mtconnect": "" },
    }),
  );
};
