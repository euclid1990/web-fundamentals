importScripts(
  'drivers/lie/lie.polyfill.min.js',
  'drivers/dexie/dexie.min.js',
  'drivers/pouchdb/pouchdb.min.js',
  'drivers/lokijs/lokijs.min.js',
  'drivers/localforage/localforage.min.js',
  'drivers/immutable/immutable.min.js',
  'tester.js'
);

var tester = createTester();

self.addEventListener('message', function (e) {
  var dbType = e.data.dbType;
  var numDocs = e.data.numDocs;
  var action = e.data.action;

  if (action === 'cleanup') {
    return tester.cleanup().then(function () {
      self.postMessage({});
    }).catch(function (e) {
      console.error('worker error', e);
      self.postMessage({ error: e.message });
    });
  }

  var test = tester.getTest(dbType);

  Promise.resolve().then(function () {
    return test(numDocs);
  }).then(function () {
    self.postMessage({ success: true });
  }).catch(function (e) {
    console.error('worker error', e);
    self.postMessage({ error: e.message });
  });
});
