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
const PROJECT_SCRIPT = "project-builder.js";
const SOURCE_UPLOADS = "uploads";
const SOURCE_HEADERS = "_headers";

// Every page other than the landing itself, as { source, route }. Each is emitted as
// dist/<route>/index.html so Cloudflare Pages serves it at a clean URL (/ugc, /privacy, ...).
// Adding a page means adding one line here — the copy loop below never changes.
const SUBPAGES = [
  { source: "ugc.dc.html", route: "ugc" },
  { source: "privacy.dc.html", route: "privacy" },
  { source: "terms.dc.html", route: "terms" },
  { source: "accessibility.dc.html", route: "accessibility" }
  ,{ source: "project.dc.html", route: "project" }
];

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

// 3. Copy every sub-page as <route>/index.html (clean-URL static routing on Cloudflare Pages)
for (const { source, route } of SUBPAGES) {
  const src = path.join(root, source);
  const dir = path.join(distDir, route);
  requireSource(src, source);
  mkdirSync(dir, { recursive: true });
  cpSync(src, path.join(dir, "index.html"));
  log(`Copied "${source}" -> dist/${route}/index.html`);
}

// 4. Copy the runtime script, unmodified
const scriptSrc = path.join(root, SOURCE_SCRIPT);
const scriptDest = path.join(distDir, SOURCE_SCRIPT);
requireSource(scriptSrc, SOURCE_SCRIPT);
cpSync(scriptSrc, scriptDest);
log(`Copied "${SOURCE_SCRIPT}" -> dist/${SOURCE_SCRIPT}`);

const projectScriptSrc = path.join(root, PROJECT_SCRIPT);
requireSource(projectScriptSrc, PROJECT_SCRIPT);
cpSync(projectScriptSrc, path.join(distDir, PROJECT_SCRIPT));
log(`Copied "${PROJECT_SCRIPT}" -> dist/${PROJECT_SCRIPT}`);

// 4b. Copy the local React vendor bundle and the resource map that points the runtime at it.
// Both must ship: vendor-map.js sets window.__resources before support.js loads, so React is
// fetched from this origin and unpkg.com is never contacted. The vendor/ files are refreshed
// from node_modules below so they can never drift from the pinned package-lock.json versions.
const VENDOR_FILES = [
  { from: path.join("node_modules", "react", "umd", "react.production.min.js"),
    to: "react-18.3.1.production.min.js" },
  { from: path.join("node_modules", "react-dom", "umd", "react-dom.production.min.js"),
    to: "react-dom-18.3.1.production.min.js" }
];
const vendorSrcDir = path.join(root, "vendor");
mkdirSync(vendorSrcDir, { recursive: true });
for (const { from, to } of VENDOR_FILES) {
  const modulePath = path.join(root, from);
  if (existsSync(modulePath)) {
    cpSync(modulePath, path.join(vendorSrcDir, to));
    log(`Refreshed vendor/${to} from ${from}`);
  } else {
    requireSource(path.join(vendorSrcDir, to), `vendor/${to} (run npm install to refresh)`);
    log(`Using committed vendor/${to} (node_modules absent)`);
  }
}
cpSync(vendorSrcDir, path.join(distDir, "vendor"), { recursive: true });
log("Copied \"vendor/\" -> dist/vendor/");

const mapSrc = path.join(root, "vendor-map.js");
requireSource(mapSrc, "vendor-map.js");
cpSync(mapSrc, path.join(distDir, "vendor-map.js"));
log("Copied \"vendor-map.js\" -> dist/vendor-map.js");

// 5. Copy the uploads/ media folder, unmodified
const uploadsSrc = path.join(root, SOURCE_UPLOADS);
const uploadsDest = path.join(distDir, SOURCE_UPLOADS);
requireSource(uploadsSrc, `${SOURCE_UPLOADS}/`);
cpSync(uploadsSrc, uploadsDest, { recursive: true });
log(`Copied "${SOURCE_UPLOADS}/" -> dist/${SOURCE_UPLOADS}/`);

// 6. Copy Cloudflare Pages security headers, unmodified
const headersSrc = path.join(root, SOURCE_HEADERS);
const headersDest = path.join(distDir, SOURCE_HEADERS);
requireSource(headersSrc, SOURCE_HEADERS);
cpSync(headersSrc, headersDest);
log(`Copied "${SOURCE_HEADERS}" -> dist/${SOURCE_HEADERS}`);

log("Build complete.");
