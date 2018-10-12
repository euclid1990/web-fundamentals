const ORIGIN = 'https://localhost:8500';
const METHOD_NAME = `${ORIGIN}/pay`;
const CHECKOUT_URL = `${ORIGIN}/checkout`;
const CHARGE_URL = `${ORIGIN}/charge`;
let resolve, reject, paymentRequestEvent;

self.addEventListener('install', event => {
  console.log('[sw] installing…');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[sw] now ready to handle');
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
