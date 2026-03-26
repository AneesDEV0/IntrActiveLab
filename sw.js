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
  // استخدام استراتيجية الشبكة أولاً (Network First) لحل مشكلة الكاش
  // سيجلب أحدث الملفات من السيرفر دائماً، وفي حال انقطاع الإنترنت سيعود للكاش
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // تحديث الكاش بالنسخة الجديدة
        return caches.open('lab-store').then((cache) => {
          cache.put(e.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // العودة للكاش فقط عند انقطاع الإنترنت أو فشل الاتصال
        return caches.match(e.request);
      })
  );
});