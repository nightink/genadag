'use strict';

var join = require('path').join;

var koa = require('koa');
var ks = require('koa-static');
var Router = require('koa-router');

module.exports = function(program) {

  var middlewares = require('./middlewares')(program);

  var app = koa();
  var routerMiddleware = new Router(app);
  routerMiddleware.methods.push('HEAD');
  app.use(ks(program.cwd));
  app.use(routerMiddleware.middleware());

  // loader middleware
  for(var md in middlewares) {
    try {
      var options = middlewares[md];
      app.use(require('./middlewares/' + md)(options, app));
      console.log('[middleware] loader %s middleware, option ', md, options);
    } catch(e) {
      console.error('[middleware] loader error, error stack \n %s', e.stack);
    }
  }

  return app;
};
