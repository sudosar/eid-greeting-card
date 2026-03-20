/**
 * Dynamic Open Graph image generation endpoint.
 * Composites the pre-generated OG background with personalized name text.
 * Uses sharp for reliable image compositing + SVG text overlay.
 * URL: /api/og-image?name=Ahmed
 */

import sharp from "sharp";
import type { Request, Response, Express } from "express";
import https from "https";

// OG image dimensions (standard)
const WIDTH = 1200;
const HEIGHT = 630;

// Cache the background image buffer
let bgImageBuffer: Buffer | null = null;
const BG_IMAGE_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-og-bg-1200x630_e8d57626.png";

// Download and cache the background image
async function loadBgImage(): Promise<Buffer> {
  if (bgImageBuffer) return bgImageBuffer;

  return new Promise((resolve, reject) => {
    const fetchUrl = (url: string) => {
      https.get(url, (res) => {
        // Follow redirects
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchUrl(res.headers.location);
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          bgImageBuffer = Buffer.concat(chunks);
          resolve(bgImageBuffer);
        });
        res.on("error", reject);
      }).on("error", reject);
    };
    fetchUrl(BG_IMAGE_URL);
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createTextOverlaySvg(name: string): Buffer {
  const displayName = escapeXml(name.trim());
  // Adjust font size based on name length
  const fontSize = displayName.length > 20 ? 32 : displayName.length > 12 ? 38 : 44;
  const bannerHeight = 120;
  const bannerY = HEIGHT - bannerHeight;

  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bannerGrad" x1="0" y1="${bannerY}" x2="0" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgb(12, 20, 69)" stop-opacity="0"/>
      <stop offset="30%" stop-color="rgb(12, 20, 69)" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="rgb(12, 20, 69)" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
  </defs>
  
  <!-- Semi-transparent banner -->
  <rect x="0" y="${bannerY}" width="${WIDTH}" height="${bannerHeight}" fill="url(#bannerGrad)"/>
  
  <!-- Decorative gold line -->
  <line x1="${WIDTH * 0.2}" y1="${bannerY + 15}" x2="${WIDTH * 0.8}" y2="${bannerY + 15}" stroke="rgba(240, 199, 94, 0.4)" stroke-width="1"/>
  
  <!-- "A special greeting for" text -->
  <text x="${WIDTH / 2}" y="${bannerY + 50}" text-anchor="middle" dominant-baseline="middle"
    font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="rgba(232, 220, 200, 0.7)"
    filter="url(#textShadow)">A special greeting for</text>
  
  <!-- Name in gold -->
  <text x="${WIDTH / 2}" y="${bannerY + 88}" text-anchor="middle" dominant-baseline="middle"
    font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="bold"
    fill="#F0C75E" filter="url(#textShadow)">${displayName}</text>
</svg>`;

  return Buffer.from(svg);
}

async function generateOgImage(name?: string): Promise<Buffer> {
  try {
    // Load and resize background image
    const bgBuffer = await loadBgImage();
    let image = sharp(bgBuffer).resize(WIDTH, HEIGHT, { fit: "cover" });

    if (name && name.trim()) {
      // Create SVG text overlay
      const svgOverlay = createTextOverlaySvg(name);

      // Composite the text overlay on top of the background
      image = image.composite([
        {
          input: svgOverlay,
          top: 0,
          left: 0,
        },
      ]);
    }

    return await image.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  } catch (error) {
    console.error("[OG Image] Generation failed:", error);

    // Fallback: create a simple gradient image with text
    const fallbackSvg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0C1445"/>
      <stop offset="60%" stop-color="#2D1B69"/>
      <stop offset="100%" stop-color="#4A2040"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <text x="${WIDTH / 2}" y="${HEIGHT / 2 - 30}" text-anchor="middle" font-family="Georgia, serif" font-size="72" font-weight="bold" fill="#F0C75E">عيد مبارك</text>
  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 40}" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="#E8DCC8" letter-spacing="8">EID MUBARAK</text>
  ${name ? `<text x="${WIDTH / 2}" y="${HEIGHT / 2 + 100}" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#F0C75E">${escapeXml(name.trim())}</text>` : ""}
</svg>`;

    return await sharp(Buffer.from(fallbackSvg)).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  }
}

export function registerOgImageRoute(app: Express) {
  app.get("/api/og-image", async (req: Request, res: Response) => {
    try {
      const name = typeof req.query.name === "string" ? req.query.name : undefined;
      const imageBuffer = await generateOgImage(name);

      res.set({
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Content-Length": imageBuffer.length.toString(),
      });
      res.send(imageBuffer);
    } catch (error) {
      console.error("[OG Image] Route error:", error);
      // Redirect to static fallback
      res.redirect(BG_IMAGE_URL);
    }
  });
}
