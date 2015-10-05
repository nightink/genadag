'use strict';

exports.startCluster = function(options, callback) {
  const opts = {
    workers: options.workers || require('os').cpus().length,
    cwd: options.cwd || process.cwd(),
    port: options.port || 8001
  };

  require('./master')(opts, callback);
};
