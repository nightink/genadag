'use strict';

exports.startCluster = function(options, callback) {
  require('./master')({
    workers: options.workers || require('os').cpus().length,
    cwd: options.cwd || process.cwd()
  }, callback);
};
