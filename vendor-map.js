/*
 * Point the dc-runtime at locally served React instead of unpkg.com.
 *
 * support.js resolves every CDN asset through cdnScriptFor(url, sri), which first checks
 * window.__resources[url]. When a string is found there it is used as the script src and the
 * CDN URL is never requested. That is the runtime's own supported override hook — we are not
 * patching or forking support.js.
 *
 * This file must load BEFORE support.js, and it is a separate file (not an inline <script>)
 * so the Content-Security-Policy can stay at script-src 'self' with no 'unsafe-inline'.
 *
 * Versions are pinned to the exact ones installed in package.json / package-lock.json
 * (react 18.3.1, react-dom 18.3.1) and the files under vendor/ are copied verbatim from
 * node_modules at build time. Keep the three in sync when upgrading.
 *
 * NOTE — this removes the unpkg.com dependency only. It does NOT remove the need for
 * 'unsafe-eval': support.js evaluates the page's <script data-dc-script> through
 * new Function() in evalDcLogic(), which is the single code path that produces the component
 * class. That is a property of the runtime itself, not of how React is delivered.
 */
window.__resources = Object.assign({}, window.__resources, {
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js':
    '/vendor/react-18.3.1.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js':
    '/vendor/react-dom-18.3.1.production.min.js'
});
