#!/usr/bin/env node
// Reproducible build: assembles dist/ for Cloudflare Pages without touching the source files.
import { existsSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

const SOURCE_HTML = "Priscila Cueva.dc.html";
const SOURCE_SCRIPT = "support.js";
const SOURCE_UPLOADS = "uploads";
const SOURCE_HEADERS = "_headers";

function log(message) {
  console.log(`[build] ${message}`);
}

function requireSource(sourcePath, label) {
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing required source: ${label} (${sourcePath})`);
  }
}

// 1. Clean/create dist/
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
  log("Removed existing dist/");
}
mkdirSync(distDir, { recursive: true });
log("Created dist/");

// 2. Copy the landing page as index.html, unmodified
const htmlSrc = path.join(root, SOURCE_HTML);
const htmlDest = path.join(distDir, "index.html");
requireSource(htmlSrc, SOURCE_HTML);
cpSync(htmlSrc, htmlDest);
log(`Copied "${SOURCE_HTML}" -> dist/index.html`);

// 3. Copy the runtime script, unmodified
const scriptSrc = path.join(root, SOURCE_SCRIPT);
const scriptDest = path.join(distDir, SOURCE_SCRIPT);
requireSource(scriptSrc, SOURCE_SCRIPT);
cpSync(scriptSrc, scriptDest);
log(`Copied "${SOURCE_SCRIPT}" -> dist/${SOURCE_SCRIPT}`);

// 4. Copy the uploads/ media folder, unmodified
const uploadsSrc = path.join(root, SOURCE_UPLOADS);
const uploadsDest = path.join(distDir, SOURCE_UPLOADS);
requireSource(uploadsSrc, `${SOURCE_UPLOADS}/`);
cpSync(uploadsSrc, uploadsDest, { recursive: true });
log(`Copied "${SOURCE_UPLOADS}/" -> dist/${SOURCE_UPLOADS}/`);

// 5. Copy Cloudflare Pages security headers, unmodified
const headersSrc = path.join(root, SOURCE_HEADERS);
const headersDest = path.join(distDir, SOURCE_HEADERS);
requireSource(headersSrc, SOURCE_HEADERS);
cpSync(headersSrc, headersDest);
log(`Copied "${SOURCE_HEADERS}" -> dist/${SOURCE_HEADERS}`);

log("Build complete.");
