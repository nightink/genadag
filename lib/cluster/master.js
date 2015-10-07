'use strict';

const path = require('path');
const cluster = require('cluster');
const cfork = require('cfork');

module.exports = function(options, callback) {
  const workerPath = path.join(__dirname, 'worker.js');
  const args = [
    '--port', options.port,
    '--baseDir', options.cwd,
    '--no-cache'
  ];

  cfork({
    exec: workerPath,
    args: args,
    silent: false,
    count: options.workers,
  });

  cluster.on('listening', function onWorkerListening() {
    console.log('[work] server start. port: %s', options.port);
    cluster.removeListener('listening', onWorkerListening);
  });

  process.title = `genadag master --port=${options.port} --baseDir=${options.cwd}`;
};
