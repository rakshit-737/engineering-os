/* Engineering OS service worker.
 * - App shell (HTML/JS/CSS/icons): stale-while-revalidate.
 * - Content JSON (content/*): network-first, cache fallback for offline.
 * Scope is the directory this file is served from (/engineering-os/ on Pages).
 */
const VERSION = 'eos-v1';
const SHELL = `${VERSION}-shell`;
const CONTENT = `${VERSION}-content`;
const BASE = new URL('./', self.location).pathname;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => c.addAll([BASE, `${BASE}index.html`, `${BASE}favicon.svg`, `${BASE}manifest.webmanifest`])).catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  if (url.pathname.startsWith(`${BASE}content/`)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CONTENT).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || Response.error())),
    );
    return;
  }

  // Navigations: network-first so new deploys show up, fall back to cached shell.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(`${BASE}index.html`, copy));
          return res;
        })
        .catch(() => caches.match(`${BASE}index.html`).then((r) => r || Response.error())),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached || Response.error());
      return cached || network;
    }),
  );
});
