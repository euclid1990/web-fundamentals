const browserSync = require('browser-sync');
const morgan = require('morgan');
const express = require('express');
const opn = require('opn');
const path = require('path');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const opnLockFile = path.join(__dirname, '.opn');

for (let site of config.sites) {
  let app = express();
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
