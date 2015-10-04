'use strict';

const path = require('path');
const cluster = require('cluster');
const cfork = require('cfork');

module.exports = function(options, callback) {
  const workerPath = path.join(__dirname, 'worker.js');
  cfork({
    exec: workerPath,
    args: ['--port', 8001, '--no-cache', '--baseDir', options.cwd],
    silent: false,
    count: options.workers,
  });
};
