'use strict';

const debug = require('debug')('ss:middlewares:cdn_proxy');

// js proxy
module.exports = function(options, app) {
  if(!options.proxyUrl) return noop;

  debug('cdn proxy url %s', options.proxyUrl);

  return function* cdnProxy(next) {
    if (this.path === '/favicon.ico' || this.status !== 404) {
      return yield* next;
    }
    const isStatic = isStaticFile(this.path);
    // /xxx??a=xx
    debug('combo query %s', this.querystring);
    const isCombo = this.querystring && this.querystring[0] === '?';

    if (isStatic && isCombo) {
      return this.redirect(options.proxyUrl + this.url);
    }

    yield* next;
  };
};

function* noop(next) {
  yield* next;
}

const STATIC_FILE_EXT_RE = /\.(js|css|jpg|png|gif|jpeg|webp|bmp|ico)$/i;
function isStaticFile(path) {
  return STATIC_FILE_EXT_RE.test(path);
}
