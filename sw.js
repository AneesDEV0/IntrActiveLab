self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('lab-store').then((cache) => cache.addAll([
      './',
      './index.html',
      './css/style.css',
      './js/script.js',
      './manifest.json',
      './video/icon.jpeg',
      './pages/ThreeD.html',
      './pages/fungus.html',
      './pages/lifecycle.html',
      './pages/name.html',
      './css/lifecycle.css',
      './css/fungus.css',
      './css/name.css',
      './css/ThreeD.css'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request).then((fetchResponse) => {
        return caches.open('lab-store').then((cache) => {
          cache.put(e.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});