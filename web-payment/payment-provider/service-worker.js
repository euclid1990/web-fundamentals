const ORIGIN = 'https://localhost:8500';
const METHOD_NAME = `${ORIGIN}/pay`;
const CHECKOUT_URL = `${ORIGIN}/checkout`;
const CHARGE_URL = `${ORIGIN}/charge`;
const CACHE_NAME = 'static';
const FILES_TO_CACHE = [
  '/pay.html',
  '/install.html',
  '/img/download.svg',
  '/img/uninstall.svg',
  '/img/mypay.png',
];
let resolve, reject, paymentRequestEvent;

self.addEventListener('install', event => {
  console.log('[sw] installing…');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)).then(() => {
      console.log('[' + CACHE_NAME + '] is created and stored.')
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[sw] now ready to handle');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('canmakepayment', function(e) {
  e.respondWith(true);
});

self.addEventListener('paymentrequest', (e)=>{
  paymentRequestEvent = e,

  // Return PromiseResolver
  e.respondWith(new Promise((a,b) => {
      resolve = ((a)=>(b)=>a(b))(a);
      reject = ((a)=>(b)=>a(b))(b);
  }));
  // Open the checkout page
  e.openWindow(CHECKOUT_URL).then((windowClient)=>{
    if (windowClient === null) reject('Failed to open window');
  }).catch((error)=>{
    reject(error);
  });
});

self.addEventListener('message', (e) => {
  let data = e.data;
  // Determine a message that tells the service worker that the window is ready
  switch (data.cmd) {
    case 'PAYMENT_APP_WINDOW_READY':
      // If `paymentRequestEvent` is not set, this isn't a message preceded by `paymentrequest` event.
      if (!paymentRequestEvent) return;
      // Now send the payment details back
      return sendPaymentRequest();
    case 'MAKE_PAYMENT':
      if (data.methodName === METHOD_NAME) {
        return createCharge(data);
      }
      // Payment `methodName` is different.
      return resolve({
        methodName: data.methodName,
        details: {
          msg: 'Payment method name is not correct'
        }
      });
    case 'STOP_PAYMENT':
      return resolve({
        methodName: data.methodName,
        details: {
          msg: 'User stop payment on request UI'
        }
      });
  }
});

const sendPaymentRequest = () => {
  // Query all open windows [/checkout]
  paymentRequestEvent && self.clients.matchAll({
    includeUncontrolled: false,
    type: 'window'
  }).then((clientList) => {
    // Send a message that contains information about the payment.
    // You can pass more details if you like.
    for (let client of clientList) {
      client.postMessage({
        cmd: 'PAYMENT_REQUEST_DETAIL',
        total: paymentRequestEvent.total,
        methodName: METHOD_NAME
      });
    }
  });
};

const createCharge = (data) => {
  return fetch(CHARGE_URL, {
    method: 'POST',
    body: JSON.stringify({
      methodName: data.methodName,
      details: data.details,
      total: paymentRequestEvent.total
    }),
    headers: { 'content-type': 'application/json' },
  })
  .then((response) => response.json())
  .then((data) => {
    resolve(data);
  });
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  console.log('Fetch event for ', e.request.url);
  e.respondWith(
    // Try the cache
    caches.match(e.request).then(response => {
      if (response) {
        console.log('Found ', e.request.url, ' in cache');
        return response;
      }
      // Fall back to network
      console.log('Network request for ', e.request.url);
      return fetch(e.request)
        .then(response => {
          // If it not in files to cache
          if (!~FILES_TO_CACHE.indexOf(url.pathname)) {
            return response;
          }

          return caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(url.pathname, response.clone());
              return response;
            });
        });
    })
  );
});
