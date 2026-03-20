import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerOgImageRoute } from "../ogImage";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Dynamic OG image generation
  registerOgImageRoute(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Simple health-check endpoint for external monitors
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, uptime: process.uptime(), timestamp: Date.now() });
  });

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);

    // ─── Keep-Alive Self-Ping ───
    // Render free-tier services sleep after 15 min of inactivity.
    // This self-ping hits our own health endpoint every 10 min to stay awake.
    if (process.env.NODE_ENV !== "development") {
      const RENDER_URL = process.env.RENDER_EXTERNAL_URL; // Render injects this automatically
      const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

      if (RENDER_URL) {
        console.log(`[keep-alive] Self-ping enabled → ${RENDER_URL}/api/health every 10 min`);
        setInterval(async () => {
          try {
            const res = await fetch(`${RENDER_URL}/api/health`);
            const data = await res.json();
            console.log(`[keep-alive] Ping OK — uptime: ${Math.round(data.uptime)}s`);
          } catch (err: any) {
            console.warn(`[keep-alive] Ping failed:`, err?.message || err);
          }
        }, PING_INTERVAL);
      } else {
        console.log(`[keep-alive] RENDER_EXTERNAL_URL not set — self-ping disabled`);
      }
    }
  });
}

startServer().catch(console.error);
