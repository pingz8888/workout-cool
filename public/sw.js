const CACHE_NAME = "workout-cool-v1";
const STATIC_CACHE = "workout-cool-static-v1";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/apple-touch-icon.png",
  "/images/favicon-32x32.png",
  "/images/favicon-16x16.png",
];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigation, stale-while-revalidate for static
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API calls and chrome extensions
  if (url.pathname.startsWith("/api/") || url.protocol === "chrome-extension:") {
    return;
  }

  // Navigation requests: network-first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached;
            // Return offline page for HTML requests
            return caches.match("/offline") || new Response("Offline", {
              status: 503,
              headers: { "Content-Type": "text/html" },
            });
          })
        )
    );
    return;
  }

  // Static assets: stale-while-revalidate
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|ico|woff2?)$/)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => cached);

          return cached || fetchPromise;
        })
      )
    );
    return;
  }
});
