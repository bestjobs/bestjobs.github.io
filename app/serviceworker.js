/*
*
* bestjobs
* Copyright
*
*/

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('bestjobs').then(function(cache) {
     return cache.addAll([
       '/index.html'
     ]);
   })
 );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});
