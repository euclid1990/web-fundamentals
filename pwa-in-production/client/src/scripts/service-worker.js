workbox.skipWaiting();
workbox.clientsClaim();

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|svg|json)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'assets',
    plugins: [new workbox.expiration.Plugin({
      maxAgeSeconds: 31536000,
      maxEntries: 30,
      purgeOnQuotaError: false
    })]
  }),
  'GET'
);
workbox.routing.registerRoute(/https:\/\/pwa-in-production.herokuapp.com\/api\/*/,
  workbox.strategies.cacheFirst({
    cacheName: 'currencies',
    plugins: [new workbox.expiration.Plugin({
      maxAgeSeconds: 3600,
      purgeOnQuotaError: false
    })]
  }),
  'GET'
);

workbox.routing.registerRoute(
  /https:\/\/query.yahooapis.com\/*/,
  workbox.strategies.networkFirst({
    cacheName: 'weathers',
    plugins: [new workbox.expiration.Plugin({
      maxAgeSeconds: 86400,
      purgeOnQuotaError: false
    })]
  }),
  'GET'
);

workbox.routing.registerRoute(
  new RegExp('manifest.json'),
  workbox.strategies.networkFirst()
);
