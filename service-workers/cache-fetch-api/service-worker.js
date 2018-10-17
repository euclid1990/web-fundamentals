const filesToCache = [
  '/',
  '/styles.css',
  '/img/fruit-collection.jpg',
  '/index.html',
  '/offline.html',
  '/404.html'
];

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  // Removing outdated caches
  // Once a new service worker has installed and a previous version isn't being used
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Skip polling of browser sync
  const url = new URL(event.request.url);
  if (~url.pathname.indexOf('browser-sync')) {
    return;
  }

  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    // Try the cache
    caches.match(event.request).then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }

      // Fall back to network
      console.log('Network request for ', event.request.url);
      return fetch(event.request)
        .then(response => {
          if (response.status === 404) {
            return caches.match('404.html');
          }
          // If it not in files to cache
          if (!~filesToCache.indexOf(url.pathname)) {
            return response;
          }
          return caches.open(staticCacheName)
            .then(cache => {
              cache.put(url.pathname, response.clone());
              return response;
            });
        });
    }).catch(error => {
      // Offline fallback image
      if (event.request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
        return new Response(
          '<svg role="img" aria-labelledby="offline-title" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><title id="offline-title">Offline</title><path fill="rgba(145,145,145,0.5)" d="M0 0h400v225H0z" /><text fill="rgba(0,0,0,0.33)" font-family="Helvetica Neue,Arial,sans-serif" font-size="30" text-anchor="middle" x="50" y="50" dominant-baseline="central">offline</text></svg>',
          { headers: { 'Content-Type': 'image/svg+xml' } }
        );
      }
      // If both fail, show a generic fallback:
      console.log('Error, ', error);
      return caches.match('offline.html');
    })
  );
});
