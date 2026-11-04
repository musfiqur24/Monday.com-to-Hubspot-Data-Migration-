import express from "express";
import helmet from "helmet";
import path from "node:path";
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
        directives: { "upgrade-insecure-requests": null },
      },
    }),
  );
  app.use((req, res, next) => {
    // Reject DNS rebinding and cross-origin browser requests, including form POSTs.
    const expected = `127.0.0.1:${rt.config.port}`;
    if (
      req.headers.host !== expected ||
      (req.headers.origin && req.headers.origin !== `http://${expected}`) ||
      req.headers["sec-fetch-site"] === "cross-site"
    )
      return res
        .status(403)
        .json({ error: "Only same-origin loopback requests are allowed." });
    next();
  });
  app.use(express.json({ limit: "100kb" }));
  app.use("/api", api(rt));
  app.use(express.static(path.join(rt.root, "public")));
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
  server.on("error", () => {
    logger.error("Local server could not start. Check PORT.");
    rt.state.close();
    process.exitCode = 1;
  });
}
