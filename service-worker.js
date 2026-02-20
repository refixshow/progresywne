const CACHE_VERSION = "v8";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

const APP_SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");

function scopedAsset(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!APP_SCOPE_PATH) return normalizedPath;
  return `${APP_SCOPE_PATH}${normalizedPath}`;
}

const STATIC_ASSETS = [
  "/",
  "index.html",
  "add-expense.html",
  "history.html",
  "shared/base.css",
  "pages/dashboard/styles.css",
  "pages/history/styles.css",
  "pages/add-expense/styles.css",
  "shared/state.js",
  "shared/storage.js",
  "shared/date.js",
  "shared/expenses.js",
  "shared/file.js",
  "features/categories/index.js",
  "features/theme/index.js",
  "features/online/index.js",
  "features/notifications/index.js",
  "features/service-worker/index.js",
  "features/receipts/index.js",
  "shared/app.js",
  "pages/dashboard/index.js",
  "pages/add-expense/index.js",
  "pages/history/index.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
].map(scopedAsset);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            return caches.delete(cache);
          }
          return Promise.resolve();
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (!url.protocol.startsWith("http")) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          if (request.destination === "document") {
            return new Response("Offline", {
              status: 503,
              headers: { "Content-Type": "text/plain" }
            });
          }
          return new Response("Offline", { status: 503 });
        });
    })
  );
});
