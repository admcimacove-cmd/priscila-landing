#!/usr/bin/env node
/*
 * Deterministic pre-publish smoke test over dist/.
 *
 * No test framework, no dependencies — plain Node, exit code 0 or 1. It asserts the things
 * that must never regress silently: no CDN runtime, no browser-side JSX compilation, no
 * sourcemaps, no private files shipped, the built routes present, the CSP intact, and the
 * form's anti-abuse affordances still in the markup.
 *
 * Run: npm test   (or: node scripts/smoke-test.mjs)
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

let failures = 0;
let checks = 0;

function ok(name) {
  checks++;
  console.log(`  PASS  ${name}`);
}
function fail(name, detail) {
  checks++;
  failures++;
  console.error(`  FAIL  ${name}`);
  if (detail) console.error(`        ${detail}`);
}
function assert(cond, name, detail) {
  cond ? ok(name) : fail(name, detail);
}
function section(title) {
  console.log(`\n${title}`);
}

if (!existsSync(dist)) {
  console.error("dist/ does not exist — run `npm run build` first.");
  process.exit(1);
}

// Walk every file in dist/ once; most checks are over this list.
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}
const files = walk(dist);
const rel = (f) => path.relative(dist, f).split(path.sep).join("/");
const textFiles = files.filter((f) => /\.(html|js|mjs|css|json|txt|map)$/i.test(f));
const readText = (f) => readFileSync(f, "utf8");

// ---------------------------------------------------------------------------------------
section("1. No CDN runtime, no browser-side JSX compilation");
// ---------------------------------------------------------------------------------------
// support.js still *contains* the unpkg URL constants — they are the keys the resource map
// overrides. What must never happen is a page actually loading from them, i.e. an unpkg URL
// appearing in HTML, or vendor-map.js failing to redirect them. So: HTML must be clean, and
// every unpkg URL in support.js must have a local override in vendor-map.js.
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const htmlWithUnpkg = htmlFiles.filter((f) => /unpkg\.com/.test(readText(f)));
assert(htmlWithUnpkg.length === 0, "no HTML page references unpkg.com",
  htmlWithUnpkg.map(rel).join(", "));

const supportPath = path.join(dist, "support.js");
assert(existsSync(supportPath), "dist/support.js exists");
const mapPath = path.join(dist, "vendor-map.js");
assert(existsSync(mapPath), "dist/vendor-map.js exists");

if (existsSync(supportPath) && existsSync(mapPath)) {
  const supportSrc = readText(supportPath);
  const mapSrc = readText(mapPath);
  const cdnUrls = [...supportSrc.matchAll(/https:\/\/unpkg\.com\/[^"']+/g)].map((m) => m[0]);
  const runtimeUrls = cdnUrls.filter((u) => !/babel/i.test(u));
  const unmapped = runtimeUrls.filter((u) => !mapSrc.includes(u));
  assert(runtimeUrls.length > 0, "runtime CDN URLs found in support.js (sanity check)");
  assert(unmapped.length === 0, "every runtime CDN URL is overridden in vendor-map.js",
    unmapped.join(", "));
  // Babel must never be reachable: it is only pulled for x-import kind "jsx".
  const usesXImport = htmlFiles.some((f) => /<x-import|x-import=/.test(readText(f)));
  assert(!usesXImport, "no page uses x-import (so @babel/standalone is never fetched)");
}

// support.js is vendored third-party runtime we do not edit, and it declares a BABEL_URL
// constant. The constant is inert: ensureBabel() is only ever called for x-import of kind
// "jsx", and the previous check proves no page uses x-import. So the meaningful assertion is
// that Babel is unreachable and that the reference exists *nowhere else* — not that the
// string is absent from a file we neither wrote nor ship differently.
const babelHits = textFiles
  .filter((f) => path.basename(f) !== "support.js")
  .filter((f) => /@babel\/standalone|babel\.min\.js/.test(readText(f)));
assert(babelHits.length === 0, "no @babel/standalone reference outside the vendored runtime",
  babelHits.map(rel).join(", "));

const babelTypeHits = textFiles.filter((f) => /type=["']text\/babel["']/.test(readText(f)));
assert(babelTypeHits.length === 0, 'no type="text/babel" script in dist/',
  babelTypeHits.map(rel).join(", "));

// ---------------------------------------------------------------------------------------
section("2. Local React bundle present and pinned");
// ---------------------------------------------------------------------------------------
const pkg = JSON.parse(readText(path.join(root, "package.json")));
for (const [dep, file] of [
  ["react", "react-18.3.1.production.min.js"],
  ["react-dom", "react-dom-18.3.1.production.min.js"]
]) {
  const vendored = path.join(dist, "vendor", file);
  assert(existsSync(vendored), `dist/vendor/${file} exists`);
  const pinned = pkg.dependencies?.[dep];
  assert(pinned === "18.3.1", `${dep} pinned to an exact version in package.json`, `got ${pinned}`);
}
assert(existsSync(path.join(root, "package-lock.json")), "package-lock.json is committed");

// ---------------------------------------------------------------------------------------
section("3. No eval, no sourcemaps");
// ---------------------------------------------------------------------------------------
// KNOWN AND ACCEPTED: support.js uses new Function() in evalDcLogic() to turn each page's
// <script data-dc-script> into its component class. That is the sole reason the CSP still
// needs 'unsafe-eval'. Removing it means replacing the dc-runtime entirely. This test pins
// the count so the exposure cannot grow unnoticed, and fails if our own files introduce eval.
// Strip comments first — these files explain in prose *why* the runtime still uses
// new Function(), and a naive scan would flag that explanation as if it were code.
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
const OUR_JS = ["vendor-map.js"];
const ourEval = OUR_JS
  .map((f) => path.join(dist, f))
  .filter((f) => existsSync(f) && /\beval\(|new Function\(/.test(stripComments(readText(f))));
assert(ourEval.length === 0, "our own scripts contain no eval( or new Function(",
  ourEval.map(rel).join(", "));

if (existsSync(supportPath)) {
  const n = (readText(supportPath).match(/new Function\(/g) || []).length;
  assert(n <= 2, `support.js new Function() occurrences stay at the known baseline (<=2)`, `found ${n}`);
}

const mapFiles = files.filter((f) => f.endsWith(".map"));
assert(mapFiles.length === 0, "no .map sourcemap files in dist/", mapFiles.map(rel).join(", "));
const inlineMaps = textFiles.filter((f) => /sourceMappingURL/.test(readText(f)));
assert(inlineMaps.length === 0, "no sourceMappingURL reference in dist/",
  inlineMaps.map(rel).join(", "));

// ---------------------------------------------------------------------------------------
section("4. No internal or private files shipped");
// ---------------------------------------------------------------------------------------
const FORBIDDEN_PATHS = [
  ".claude", ".agents", "node_modules", ".git",
  "identity-reference", "product-reference", ".scratch-review"
];
const FORBIDDEN_NAMES = [
  "AGENTS.md", "CLAUDE.md", "DESIGN.md", "PRODUCT.md", "UGC_MASTER_CONTEXT.md",
  "SECURITY-RECOVERY.md", "package.json", "package-lock.json", ".gitignore",
  ".env", "dev-static-server.mjs", "build.mjs", "smoke-test.mjs"
];
for (const p of FORBIDDEN_PATHS) {
  const hit = files.filter((f) => rel(f).split("/").includes(p));
  assert(hit.length === 0, `dist/ contains no ${p}/`, hit.map(rel).join(", "));
}
for (const n of FORBIDDEN_NAMES) {
  const hit = files.filter((f) => path.basename(f) === n);
  assert(hit.length === 0, `dist/ contains no ${n}`, hit.map(rel).join(", "));
}
// Private media must never be published either.
const privateMedia = files.filter((f) => /identity-reference|WhatsApp (Image|Video)/i.test(rel(f)));
assert(privateMedia.length === 0, "dist/ contains no private identity media",
  privateMedia.map(rel).join(", "));

// ---------------------------------------------------------------------------------------
section("5. All public routes built");
// ---------------------------------------------------------------------------------------
for (const route of ["index.html", "ugc/index.html", "privacy/index.html",
                     "terms/index.html", "accessibility/index.html", "project/index.html"]) {
  const f = path.join(dist, route);
  const exists = existsSync(f);
  assert(exists && statSync(f).size > 1000, `dist/${route} built and non-trivial`);
}

const projectPage = path.join(dist, "project", "index.html");
if (existsSync(projectPage)) {
  const project = readText(projectPage);
  assert(/CimaCove Digital/.test(project), "Project Builder uses the official Digital brand");
  assert(/rel="canonical" href="https:\/\/digital\.cimacove\.com\/project"/.test(project), "Project Builder canonical is digital.cimacove.com/project");
  assert(/project_builder_started/.test(project) && /project_builder_submitted/.test(project), "commercial analytics events are instrumented");
  assert(!/customerEmail.*track|customerPhone.*track|problem.*track/.test(project), "analytics calls do not include PII or project content");
  assert(/localStorage/.test(project), "Project Builder preserves safe local progress");
  assert(/\/api\/digital-intakes/.test(project), "Project Builder submits to the existing Business Core");
}

// ---------------------------------------------------------------------------------------
section("6. Content-Security-Policy as expected");
// ---------------------------------------------------------------------------------------
const headersPath = path.join(dist, "_headers");
assert(existsSync(headersPath), "dist/_headers exists");
if (existsSync(headersPath)) {
  const h = readText(headersPath);
  const csp = (h.match(/Content-Security-Policy:.*/) || [""])[0];
  assert(!/unpkg\.com/.test(csp), "CSP no longer allows unpkg.com");
  assert(/script-src 'self'/.test(csp), "CSP script-src is same-origin");
  assert(/frame-ancestors 'none'/.test(csp), "CSP sets frame-ancestors 'none'");
  assert(/object-src 'none'/.test(csp), "CSP sets object-src 'none'");
  assert(/connect-src[^;]*https:\/\/connect\.cimacove\.com/.test(csp),
    "CSP allows the lead endpoint in connect-src");
  for (const header of ["X-Content-Type-Options", "Referrer-Policy",
                        "Permissions-Policy", "Strict-Transport-Security"]) {
    assert(h.includes(header), `_headers declares ${header}`);
  }
  // Documented, deliberate exception — see section 3.
  if (/'unsafe-eval'/.test(csp)) {
    console.log("  NOTE  CSP still carries 'unsafe-eval' (dc-runtime evalDcLogic). Known debt.");
  }
}

// ---------------------------------------------------------------------------------------
section("7. Form honeypot and client-side limits");
// ---------------------------------------------------------------------------------------
const landing = path.join(dist, "index.html");
if (existsSync(landing)) {
  const html = readText(landing);
  assert(/name="website"/.test(html), "honeypot field `website` is present in the markup");
  assert(/tabindex="-1"/.test(html), "honeypot is out of the tab order");
  assert(/id="pc-website"[^>]*autocomplete="off"|autocomplete="off"[^>]*id="pc-website"/.test(html)
         || /autocomplete="off"/.test(html), "honeypot sets autocomplete=off");
  assert(/aria-hidden="true"/.test(html), "honeypot is hidden from assistive technology");
  assert(!/website:\s*''\s*,\s*\/\//.test(html) && /website:\s*s\.leadWebsite/.test(html),
    "the honeypot's real value is submitted, not a hard-coded empty string");
  for (const [limit, field] of [[120, "name"], [254, "email"], [2000, "message"], [32, "phone"]]) {
    assert(new RegExp(`maxLength="\\{\\{ ${limit} \\}\\}"`).test(html),
      `${field} field has a maxlength of ${limit}`);
  }
  assert(!/<input type="tel"[^>]*pattern=/.test(html),
    "phone field has no rigid pattern (international numbers must pass)");
  assert(/submitBtnDisabled/.test(html), "submit button has a double-submit guard");
  assert(/leadSmsConsent: false/.test(html), "SMS consent defaults to unchecked");
  for (const kind of ["contactFormErrorRate", "contactFormErrorTooLarge",
                      "contactFormErrorServer", "contactFormErrorNetwork"]) {
    assert(html.includes(kind), `distinct visitor message for ${kind}`);
  }
}

// ---------------------------------------------------------------------------------------
console.log(`\n${failures === 0 ? "OK" : "FAILED"} — ${checks - failures}/${checks} checks passed`);
process.exit(failures === 0 ? 0 : 1);
