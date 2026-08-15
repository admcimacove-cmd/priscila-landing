#!/usr/bin/env node
// Minimal static file server for previewing dist/ locally, no dependencies.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "dist");
const port = 8934;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

// Resolve a request path strictly inside dist/. Without this, "/../package.json" escapes the
// web root and serves any file in the repo — verified exploitable before this guard was added.
// It matters because the server binds to every interface, so anything that can reach the port
// (any device on the same Wi-Fi) could read private files such as identity-reference/.
function safeResolve(urlPath) {
  const resolved = path.resolve(root, "." + path.posix.normalize("/" + urlPath.replace(/\\/g, "/")));
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) return null;
  return resolved;
}

createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    let filePath = safeResolve(urlPath);
    if (!filePath) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    let st;
    try {
      st = await stat(filePath);
    } catch {
      st = null;
    }

    if (st && st.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    } else if (!st) {
      const fallback = safeResolve(path.posix.join("/", urlPath, "index.html"));
      if (!fallback) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
      }
      filePath = fallback;
    }

    const data = await readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch (e) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found: " + req.url);
  }
}).listen(port, () => console.log(`[dev-static-server] serving dist/ on http://localhost:${port}`));
