import express from "express";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { Agent, setGlobalDispatcher } from "undici";
import { api } from "./routes/api.js";

// Configure connection pooling for parallel Monday and HubSpot API calls.
// keepAliveTimeout is kept at 4000ms to safely close idle sockets before Cloudflare / AWS edge timeouts (typically 5s) cause ECONNRESET.
setGlobalDispatcher(
  new Agent({
    connections: 32,
    pipelining: 1,
    keepAliveTimeout: 4000,
    keepAliveMaxTimeout: 15000,
  }),
);
import { runtime } from "./services/runtime.js";
import { safeError } from "./lib/sanitize.js";
import { logger } from "./lib/logger.js";
export function createApp(rt) {
  const app = express();
  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "upgrade-insecure-requests": null,
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'"],
          workerSrc: ["'self'", "blob:"],
        },
      },
    }),
  );
  app.use((req, res, next) => {
    // Reject DNS rebinding and cross-origin browser requests, including form POSTs.
    const allowedHosts = [`127.0.0.1:${rt.config.port}`, `localhost:${rt.config.port}`];
    const isAllowedHost = allowedHosts.includes(req.headers.host);
    const isAllowedOrigin = !req.headers.origin || allowedHosts.some(h => req.headers.origin === `http://${h}`);
    if (!isAllowedHost || !isAllowedOrigin || req.headers["sec-fetch-site"] === "cross-site")
      return res
        .status(403)
        .json({ error: "Only same-origin loopback requests are allowed." });
    next();
  });
  app.use(express.json({ limit: "100kb" }));
  app.use("/api", (req, res, next) => {
    if (req.path === "/progress" || req.path === "/status") return next();
    const start = Date.now();
    res.on("finish", () => {
      const ms = Date.now() - start;
      logger.info(`${req.originalUrl} -> ${res.statusCode} (${ms}ms)`, { method: req.method });
    });
    next();
  });
  app.use("/api", api(rt));
  app.use("/api", (req, res) => res.status(404).json({
    error: "This API route is unavailable. Restart the app with npm start and refresh the page.",
    code: "API_ROUTE_NOT_FOUND",
  }));
  app.get("/vendor/lucide.js", (req, res) => res.sendFile(path.join(rt.root, "node_modules/lucide/dist/umd/lucide.min.js")));
  const distDir = path.join(rt.root, "frontend/dist");
  const publicDir = path.join(rt.root, "frontend/public");
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
  }
  app.use(express.static(publicDir));
  app.get(/^(?!\/api).*/, (req, res) => {
    const indexPath = fs.existsSync(path.join(distDir, "index.html"))
      ? path.join(distDir, "index.html")
      : path.join(publicDir, "index.html");
    res.sendFile(indexPath);
  });
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    res
      .status(error.status || (error.code === "LIMIT_FILE_SIZE" ? 413 : 400))
      .json({ error: safeError(error) });
  });
  return app;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const rt = runtime();
  const app = createApp(rt);
  rt.migration.on("activity", (entry) => {
    console.log(
      `[${entry.timestamp}] ${entry.level.toUpperCase()} ${entry.message}`,
    );
  });
  const server = app.listen(rt.config.port, "127.0.0.1", () => {
    console.log(
      `\nTRT migration is running\nOpen: http://127.0.0.1:${rt.config.port}\nPress Ctrl+C to stop.\n`,
    );
  });
  server.on("error", (error) => {
    const message = error.code === "EADDRINUSE"
      ? `Port ${rt.config.port} is already in use. Stop the existing app instance before running npm start, or choose another PORT in .env.`
      : error.code === "EACCES"
        ? `Access to port ${rt.config.port} was denied. Choose another PORT in .env.`
        : `Local server could not start (${error.code || "UNKNOWN"}). Check the configured PORT.`;
    logger.error({ code: error.code, port: rt.config.port }, message);
    rt.state.close();
    process.exitCode = 1;
  });
}
