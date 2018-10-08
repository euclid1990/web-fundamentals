const nodemon = require('nodemon');
const path = require('path');
const fs = require('fs');
const opnLockFile = path.join(__dirname, '.opn');

nodemon({ script: 'app.js' })
  .on('start', () => {
    console.log('Nodemon started');
  })
  .on('quit', function () {
    fs.existsSync(opnLockFile) && fs.unlinkSync(opnLockFile);
    process.exit(0);
  })
