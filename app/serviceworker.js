/*
 bestjobs.github.io
 Copyright © 2018 bestjobs. All rights reserved!
*/

var CACHE_NAME = 'bestjobs';
var urlsToCache = [
  '/',
  '/*.html'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
