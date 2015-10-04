'use strict';

module.exports = function(options, app) {
  return function* poweredBy(next) {
    this.app.poweredBy = false;
    this.set('X-Powered-By', 'ink');
    yield next;
  };
};
