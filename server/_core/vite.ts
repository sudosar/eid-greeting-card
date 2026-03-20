import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

/**
 * Inject dynamic OG meta tags into the HTML template based on query parameters.
 * This enables personalized social media previews when sharing links like ?name=Ahmed
 */
function injectDynamicOgTags(html: string, url: string): string {
  try {
    const urlObj = new URL(url, "http://localhost");
    const name = urlObj.searchParams.get("name");
    const msg = urlObj.searchParams.get("msg");

    if (!name && !msg) return html;

    const decodedName = name ? decodeURIComponent(name).trim() : null;
    const decodedMsg = msg ? decodeURIComponent(msg).trim() : null;

    // Build dynamic title and description
    const title = decodedName
      ? `Eid Mubarak, ${decodedName}! — عيد مبارك ✨🌙`
      : "Eid Mubarak — عيد مبارك ✨🌙";

    let description = decodedName
      ? `A special Eid greeting for ${decodedName}. May this blessed occasion bring peace, happiness, and prosperity.`
      : "May this blessed occasion bring peace, happiness, and prosperity to you and your loved ones.";

    if (decodedMsg) {
      description += ` ${decodedMsg}`;
    }

    // Build dynamic OG image URL with name parameter
    const ogImagePath = decodedName
      ? `/api/og-image?name=${encodeURIComponent(decodedName)}`
      : "/api/og-image";

    // Replace static OG tags with dynamic ones
    html = html.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(title)}" />`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(description)}" />`
    );
    html = html.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${ogImagePath}" />`
    );
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`
    );
    html = html.replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${ogImagePath}" />`
    );
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(title)}</title>`
    );
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`
    );
  } catch {
    // If URL parsing fails, return unmodified HTML
  }
  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      let page = await vite.transformIndexHtml(url, template);

      // Inject dynamic OG tags based on query parameters
      page = injectDynamicOgTags(page, url);

      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist — with dynamic OG injection
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");
    html = injectDynamicOgTags(html, req.originalUrl);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
}
