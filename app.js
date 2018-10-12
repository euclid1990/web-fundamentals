const browserSync = require('browser-sync');
const morgan = require('morgan');
const express = require('express');
const opn = require('opn');
const path = require('path');
const fs = require('fs');
const https = require('https');
const corsProxy = require('cors-anywhere');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const opnLockFile = path.join(__dirname, '.opn');

for (let site of config.sites) {
  const app = express();
  app.use(morgan(`[${site.context}] :method :url :status - :response-time ms :res[content-length] bytes`));
  app.get('/favicon.ico', (req, res) => res.status(204));
  app.use(express.static(path.join(__dirname, site.context)));
  app.listen(site.port, site.host, function() {
    let proxy = `${site.host}:${site.port}`;
    console.log(`Listening on http://${proxy} with context=${site.context}`);

    browserSync.create().init({
        files: [path.join(__dirname, site.context, '/**/*.{html,js,css}')],
        online: false,
        open: false,
        port: site.browserSyncPort,
        proxy: proxy,
        ui: false,
        ghostMode: false
    });

    // Open index.html on browsers
    if (site.context === '/' && !fs.existsSync(opnLockFile)) {
      fs.closeSync(fs.openSync(opnLockFile, 'w'));
      opn(`http://${site.host}:${site.browserSyncPort}`);
    }
  });
}

// Proxy which adds CORS headers to the proxied request
corsProxy.createServer({
    originWhitelist: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(config.cors.port, config.cors.host, function() {
    console.log(`Listening CORS Proxy on http://${config.cors.host}:${config.cors.port}`);
});

// Self Payment Service Provider
(function() {
  let payment = config.payment;
  const key = fs.readFileSync(payment.ssl.key);
  const cert = fs.readFileSync(payment.ssl.cert);
  const ca = fs.readFileSync(payment.ssl.ca);
  const credentials = { key, cert, ca };
  const app = express();
  const server = https.createServer(credentials, app);
  app.set('view engine', 'html');
  app.use(morgan(`[${payment.context}] :method :url :status - :response-time ms :res[content-length] bytes`));
  app.get('/favicon.ico', (req, res) => res.status(204));
  app.use(express.static(path.join(__dirname, payment.context)));
  app.use(express.json());
  app.use(function(req, res, next) {
    // Payment Method Manifest: https://w3c.github.io/payment-method-manifest/
    res.status(200).links({
      'payment-method-manifest': 'https://localhost:8500/payment-manifest.json',
    });
    return next();
  });
  app.get('/pay', function(req, res) {
    res.sendFile(path.join(__dirname, payment.context, 'pay.html'));
  })
  app.get('/checkout', function(req, res) {
    res.sendFile(path.join(__dirname, payment.context, 'checkout.html'));
  })
  app.post('/charge', function(req, res) {
    let response = { methodName: req.body.methodName, details: {} };
    if (+(req.body.total.value) < 100) {
      response.details = {
        ok: true,
        msg: 'Payment is completed'
      };
    } else {
      response.details = {
        ok: false,
        msg: 'The card enough available balance to pay'
      };
    }
    res.json(response);
  })
  server.listen(payment.port, payment.host, function() {
    let proxy = `${payment.host}:${payment.port}`;
    console.log(`Listening Payment Service on https://${payment.host}:${payment.port} with context=${payment.context}`);
  });
})();
