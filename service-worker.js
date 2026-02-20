const CACHE_VERSION = "v6";
const CACHE_NAME = `wydatki-checker-${CACHE_VERSION}`;
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
  "icons/icon-512.png",
].map(scopedAsset);

self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalacja");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Cache'owanie statycznych zasobów");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.log("Błąd cache'owania:", err);
      }),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Aktywacja");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log("Service Worker: Usuwanie starego cache");
            return caches.delete(cache);
          }
        }),
      );
    }),
  );

  return self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) return;

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!url.protocol.startsWith("http")) {
    return;
  }

  if (request.method === "GET") {
    if (
      request.destination === "style" ||
      request.destination === "script" ||
      request.destination === "image"
    ) {
      event.respondWith(cacheFirstStrategy(request));
    } else if (request.destination === "document") {
      event.respondWith(networkFirstStrategy(request));
    } else {
      event.respondWith(networkFirstStrategy(request));
    }
  }
});

async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log("Service Worker: Zwracam z cache:", request.url);

      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, response);
            });
          }
        })
        .catch(() => {});

      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Service Worker: Błąd sieci, szukam w cache");

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (request.destination === "document") {
      return new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (request.destination === "image") {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#1a1a2e" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="#a0a0b0" font-size="16">Offline</text></svg>',
        { headers: { "Content-Type": "image/svg+xml" } },
      );
    }

    return new Response("Offline", { status: 503 });
  }
}

async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Service Worker: Network failed, próbuję cache");

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response("Offline", { status: 503 });
  }
}

self.addEventListener("push", (event) => {
  console.log("Service Worker: Otrzymano push notification");

  const options = {
    body: event.data ? event.data.text() : "Nowe powiadomienie",
    icon: scopedAsset("icons/icon-192.png"),
    badge: scopedAsset("icons/icon-72.png"),
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification("Wydatki Checker", options),
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Kliknięto powiadomienie");

  event.notification.close();

  event.waitUntil(clients.openWindow(scopedAsset("/")));
});

self.addEventListener("message", (event) => {
  console.log("Service Worker: Otrzymano wiadomość:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cache) => caches.delete(cache)));
      }),
    );
  }
});
