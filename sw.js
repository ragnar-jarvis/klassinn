/* Klassinn preview SW — network-first HTML, never return null. */
const CACHE = 'klassinn-preview-v23';
const PRECACHE = [
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './mark-k.png',
  './logo-header.png',
  './logo-klassinn-v2.png',
  './logo-klassinn-da.png',
  './thumb-purple.png',
];

function offlinePage() {
  return new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>KLASSINN</title><body style="font-family:system-ui;padding:24px;background:#FAF7F2;color:#2F2438">' +
      '<h1>KLASSINN</h1><p>Engin nettenging rétt núna. Athugaðu Wi‑Fi og endurhladdu síðuna.</p>' +
      '<p><button onclick="location.reload()">Reyna aftur</button></p></body>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => undefined))),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase-pakkinn (gstatic): geymdur svo appið opnist líka án nets
  if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(req).then((hit) => hit || fetch(req).then((res) => {
          if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
          return res;
        })),
      ),
    );
    return;
  }
  if (url.origin !== self.location.origin) return;

  const isHtml =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html') ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('.html');

  // Always network for HTML — never serve stale note editor layout.
  if (isHtml) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => res)
        .catch(async () => {
          const cached =
            (await caches.match('./index.html')) ||
            (await caches.match(req)) ||
            (await caches.match('./'));
          return cached || offlinePage();
        }),
    );
    return;
  }

  // Never cache the service worker file itself
  if (url.pathname.endsWith('/sw.js')) {
    event.respondWith(fetch(req, { cache: 'no-store' }));
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => offlinePage());
    }),
  );
});
