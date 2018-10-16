const curlStr = `curl -X POST \
-H "Authorization: key=%server_key%" \
-H "Content-Type: application/json" -d '{
  "notification": {
    "body": "%body%",
    "title": "%title%",
  },
  "to": "%token%"
}' \
https://fcm.googleapis.com/fcm/send`;

const curlMsgHandlerStr = `curl -X POST \
-H "Authorization: key=%server_key%" \
-H "Content-Type: application/json" -d '{
  "data": {
    "notification": {
      "body": "%body%",
      "title": "%title%",
    }
  },
  "to": "%token%"
}' \
https://fcm.googleapis.com/fcm/send`;

function curl(serverKey, token) {
  const curlOutput = document.getElementById('curl');
  const curlBackgroundOutput = document.getElementById('curl-background');

  curlOutput.textContent =
    curlStr.replace('%server_key%', serverKey)
      .replace('%token%', token)
      .replace('%title%', 'FCM Message')
      .replace('%body%', `Message created at ${new Date()}`);

  curlBackgroundOutput.textContent =
    curlMsgHandlerStr.replace('%server_key%', serverKey)
      .replace('%token%', token)
      .replace('%title%', 'FCM Message Background')
      .replace('%body%', `Message handled in background at ${new Date()}`);
}

function log() {
  let line = Array.prototype.slice.call(arguments).map(function(argument) {
    return typeof argument === 'string' ? argument : JSON.stringify(argument);
  }).join(' ');
  let log = document.getElementById('log');
  log.textContent += line + '\n';
  log.scrollTop = log.scrollHeight;
}

function clearLog() {
  document.getElementById('log').textContent = '';
}

const clipboard = new ClipboardJS('.clipboard');
clipboard.on('success', function(e) {
  alert('Copied!');
  e.clearSelection();
});

const app = (() => {
  'use strict';

  if (!('Notification' in window)) {
    log('Notifications not supported in this browser');
    return;
  }

  let token, serverKey;
  const notifyButton = document.getElementById('notify');
  const addButton = document.getElementById('add');
  const pushButton = document.getElementById('push');
  const serverKeyInput = document.getElementById('server_key');

  // Firebase configuration
  const config = {
    messagingSenderId: '990609591043',// '<SENDER_ID>'
  };

  // Init firebase app
  firebase.initializeApp(config);

  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();

  // Add the public key generated from the console here.
  messaging.usePublicVapidKey('BIwd0hGrfgXfUEYmOjqJo3Pj6LAQGUrxq_ke_BFEl_TMYj_zX6XEtlyMU3BwzComriL3NxX-ZOlIqnYTKpfZxEI'/*'<YOUR_PUBLIC_VAPID_KEY_HERE>'*/);

  // Handle incoming messages. Called when:
  // - A message is received while the app has focus
  // - The user clicks on an app notification created by a service worker `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {
    log('Message received ⬇️');
    log('> ', payload);
  });

  notifyButton.addEventListener('click', (e) => {
    log('Requesting permission...');
    messaging.requestPermission().then(function() {
      log('> Notification permission granted.');
    }).catch(function(err) {
      log('> Unable to get permission to notify.', err);
    });
  });

  addButton.addEventListener('click', (e) => {
    log('Subscribing to topics...');
    let subscription = {
      to: '/topics/news',
      registration_tokens: [ token ]
    };
    return fetch('https://iid.googleapis.com/iid/v1:batchAdd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + serverKey
      },
      body: JSON.stringify(subscription)
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Bad status code from server.');
      }
      return response.json();
    })
    .then(function(data) {
      if (!data.results || data.results.error) {
        throw new Error('Bad response from server.');
      }
      log('> HTTP 200 OK', data);
    });
  });

  pushButton.addEventListener('click', (e) => {
    log('Publishing to topics...');
    let notification = {
      to: '/topics/news',
      notification: {
        body: `Message created at ${new Date()}`,
        title: 'FCM Message',
      }
    };
    return fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + serverKey
      },
      body: JSON.stringify(notification)
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Bad status code from server.');
      }
      return response.json();
    })
    .then(function(data) {
      if (!data.message_id) {
        throw new Error('Bad response from server.');
      }
      log('> HTTP 200 OK', data);
    });
  });

  serverKeyInput.addEventListener('change', (e) => {
    serverKey = e.target.value;
    serverKey = serverKey.trim();
    if (serverKey) {
      window.localStorage.setItem('serverKey', serverKey);
      curl(serverKey, token);
    }
  });

  function initializeUI() {
    serverKey = window.localStorage.getItem('serverKey');
    if (serverKey !== null) {
      serverKeyInput.value = serverKey;
    }
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('Service Worker and Push is supported');

      navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker is registered', registration);
        // Use own service worker for receiving push messages
        messaging.useServiceWorker(registration);
        // Callback fired if Instance ID token is updated.
        messaging.onTokenRefresh(() => {
          messaging.getToken().then((refreshedToken) => {
            log('Token refreshed. \n> ', refreshedToken);
            token = refreshedToken;
            curl(serverKey, token);
          }).catch(function(err) {
            console.error('Unable to retrieve refreshed token.', err);
          });
        });

        // Get Instance ID token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        messaging.getToken().then((currentToken) => {
          if (currentToken) {
            log('Current token.\n> ', currentToken);
            token = currentToken;
            curl(serverKey, token);
          } else {
            log('No Instance ID token available. Request permission to generate one.');
          }
        }).catch(function(err) {
          console.error('An error occurred while retrieving token. ', err);
        });

        initializeUI();
      })
      .catch(err => {
        console.error('Service Worker Error', err);
      });
    });
  } else {
    log('Push messaging is not supported');
  }

})();
