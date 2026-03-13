self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('lab-store').then((cache) => cache.addAll([
      './',
      './index.html',
      './css/style.css',
      './js/script.js'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});