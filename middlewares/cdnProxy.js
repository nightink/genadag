'use strict';

// js proxy
module.exports = function cdnProxy(options) {
  if(!options.proxyUrl) return noop;

  return function* cdnProxy(next) {
    if (this.path === '/favicon.ico' || this.status !== 404) {
      return yield* next;
    }
    var isStatic = isStaticFile(this.path);
    // /xxx??a=xx
    var isCombo = this.querystring && this.querystring[0] === '?';
    if (isStatic || isCombo) {
      return this.redirect(options.proxyUrl + this.url);
    }

    yield* next;
  };
};

function* noop(next) {
  yield* next
}

var STATIC_FILE_EXT_RE = /\.(js|css|jpg|png|gif|jpeg|webp|bmp|ico)$/i;
function isStaticFile(path) {
  return STATIC_FILE_EXT_RE.test(path);
}
