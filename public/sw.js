self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);

// No caching, just pass-through (safe for dev)
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
