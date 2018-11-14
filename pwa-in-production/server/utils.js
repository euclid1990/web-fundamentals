const moment = require('moment');

// Get environment variable function
function env(e, d = '') {
  if (typeof process.env[e] === 'undefined' || process.env[e] === '') return d;
  return process.env[e];
}

function nowUtc() {
  return moment().utc().format('YYYY-MM-DD HH:mm:ss'); // Convert to UTC
}

function utcToLocal(date) {
  let dateUtc = moment.utc(date).toDate();
  return moment(dateUtc).local().format('YYYY-MM-DD HH:mm:ss'); // Convert to Local
}

module.exports = {
  env,
  nowUtc,
  utcToLocal
};
