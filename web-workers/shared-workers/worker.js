var nextName = 0;
function getNextName() {
  // This could use more friendly names but for now just return a number
  return nextName++;
}

var workers = {};
var p = 0;

onconnect = function(e) {
  // Get worker name
  let name = getNextName();
  // Port associated with shared worker
  let port = e.ports[0];
  // Store instance worker
  workers[name] = {
    port: e.ports[0],
    name: name
  };

  port.postMessage({ msg: 'On-connect event. #worker' + name });

  port.onmessage = function(e) {
    let data = e.data;
    switch (data.cmd) {
      case '$c':
        // Broadcasting messages to all workers
        for (let w in workers)
          workers[w].port.postMessage({ cmd: '$c' });
        break;
      case '$p':
        ++p;
        // Broadcasting messages to all workers
        for (let w in workers)
          workers[w].port.postMessage({ msg: data.msg + ' #' + p });
        break;
      default:
        port.postMessage({ msg: 'Sent message from Background. #worker' + name + ' #' + data.msg }); /* e.target.postMessage('pong'); would work also */
    };
  }
}
