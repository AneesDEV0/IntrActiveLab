const CACHE_NAME = 'lab-store-v9';
const APP_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './video/icon.jpeg',
  './images/land.png',
  './css/style.css',
  './css/nav.css',
  './css/lifecycle.css',
  './css/fungus.css',
  './css/name.css',
  './css/ThreeD.css',
  './css/bacteria-lab.css',
  './css/sweetalert2.min.css',
  './js/script.js',
  './js/nav-loader.js',
  './js/footer.js',
  './js/db.js',
  './js/sweetalert2.all.min.js',
  './js/ThreeD.js',
  './js/fungus.js',
  './js/lifecycle.js',
  './js/bacteria-lab.js',
  './js/bacteria-lab-visuals.js',
  './pages/ThreeD.html',
  './pages/about.html',
  './pages/fungus.html',
  './pages/lifecycle.html',
  './pages/name.html',
  './pages/bacteria-lab.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
