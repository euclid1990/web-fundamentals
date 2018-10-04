const cacheName = 'static-v1';

/**
 * On install: Caching the application shell
 */
self.addEventListener('install', event => {
  console.log('Version [v1] installing…');

  // Cache a [index] HTML & [cat][pig] PNG
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(
      [
        '/',
        '/index.html',
        '/img/bird.png',
        '/img/cat.png',
        '/img/pig.png',
      ]
    )).then(() => {
      console.log('[' + cacheName + '] is created and stored.')
      // Make your new service worker activate sooner without wait until
      // the existing worker is controlling zero clients. (Note refresh does not affect number clients.)
      self.skipWaiting();
    })
  );
});

/**
 * On activate: Remove outdated caches
 */
self.addEventListener('activate', event => {
  console.log('[' + cacheName + '] now ready to handle fetches!');

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        console.log('Found cache name: ', key);
        if (key !== cacheName) return caches.delete(key);
      }));
    })
  );
  return self.clients.claim();
});

// Do not manually clear cache # https://github.com/GoogleChromeLabs/sw-precache/issues/185
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  caches.match(event.request).then(function(response) {
    console.log('Network request for ', event.request.url);
    // Cache hit
    if (response) {
      console.log('Found ', event.request.url, ' in cache');
    }
  });

  // Serve the [Cat] PNG from the cache if the request is same-origin and the path is '/pig.png'
  if (url.origin == location.origin && url.pathname == '/img/pig.png') {
    event.respondWith(caches.match('/img/cat.png'));
  }

  // Serve the [Bird] PNG from the cache if the request is same-origin and the path is '/bird.png'
  if (url.origin == location.origin && url.pathname == '/img/bird.png') {
    event.respondWith(caches.match('/img/bird.png'));
  }

  // Serve the [Index] HTML from the cache if the request is same-origin and the path is '/'
  if (url.origin == location.origin && url.pathname == '/') {
    event.respondWith(caches.match('/index.html'));
  }
});
