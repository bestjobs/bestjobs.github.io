/*
 bestjobs.github.io
 Copyright © 2018 bestjobs. All rights reserved!
*/

const cacheName = `bestjobs`;
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `/`, // Alias for index.html
        `/*.html`
      ])
          .then(() => self.skipWaiting());
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
