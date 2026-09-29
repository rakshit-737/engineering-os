/* Engineering OS service worker.
 *
 * VERSION is replaced at build time (vite.config.ts -> pagesPlugin) with a hash of
 * the built index.html + content payloads, so every deploy gets fresh caches and
 * old ones are deleted on activate. In an un-built copy it stays "dev".
 *
 * Strategies:
 *  - navigations + content/*.json: network-first (revalidated, not HTTP-cached),
 *    cached copy only when offline; offline page when nothing is cached.
 *  - assets/* (content-hashed, immutable): cache-first.
 *  - everything else in scope (icons, manifest): stale-while-revalidate.
 * Only same-origin, status-200, non-opaque responses are ever stored.
 * Scope is the directory this file is served from (/engineering-os/ on Pages).
 */
const VERSION = 'eos-__BUILD_ID__';
const SHELL = `${VERSION}-shell`;
const CONTENT = `${VERSION}-content`;
const BASE = new URL('./', self.location).pathname;
const INDEX = `${BASE}index.html`;

const OFFLINE_HTML =
  '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>Offline — Engineering OS</title><body style="font-family:system-ui;padding:2rem;max-width:40rem;margin:auto">' +
  '<h1>You are offline</h1><p>This page has not been cached yet. Reconnect and reload.</p></body>';

function cacheable(res) {
  return !!res && res.ok && res.status === 200 && res.type === 'basic';
}

function put(cacheName, key, res) {
  if (!cacheable(res)) return;
  const copy = res.clone();
  caches.open(cacheName).then((c) => c.put(key, copy)).catch(() => undefined);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((c) =>
        Promise.all(
          [INDEX, `${BASE}favicon.svg`, `${BASE}manifest.webmanifest`].map((u) =>
            fetch(u, { cache: 'reload' })
              .then((res) => (cacheable(res) ? c.put(u, res) : undefined))
              .catch(() => undefined),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('eos-') && !k.startsWith(`${VERSION}-`)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function networkFirst(req, cacheName, cacheKey, fallback) {
  return fetch(req, { cache: 'no-cache' })
    .then((res) => {
      put(cacheName, cacheKey, res);
      return res;
    })
    .catch(() => caches.match(cacheKey).then((r) => r || fallback()));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  if (req.mode === 'navigate') {
    // HashRouter: every in-scope navigation renders the same shell.
    event.respondWith(
      networkFirst(req, SHELL, INDEX, () => new Response(OFFLINE_HTML, { status: 503, headers: { 'content-type': 'text/html; charset=utf-8' } })),
    );
    return;
  }

  if (url.pathname.startsWith(`${BASE}content/`)) {
    event.respondWith(networkFirst(req, CONTENT, req, () => Response.error()));
    return;
  }

  if (url.pathname.startsWith(`${BASE}assets/`)) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            put(SHELL, req, res);
            return res;
          }),
      ),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          put(SHELL, req, res);
          return res;
        })
        .catch(() => cached || Response.error());
      return cached || network;
    }),
  );
});
