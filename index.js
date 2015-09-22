'use strict';

var join = require('path').join;

var debug = require('debug')('ss');
var koa = require('koa');
var ks = require('koa-static');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');

module.exports = function(program) {

  var middlewares = require('./middlewares')(program);

  var app = koa();
  var routerMiddleware = new Router(app);

  app.use(bodyParser());
  app.use(ks(program.cwd));

  routerMiddleware.methods.push('HEAD');
  app.use(routerMiddleware.middleware());

  // loader middleware
  Object.keys(middlewares).forEach(function(mid) {
    try {
      var options = middlewares[mid];
      app.use(require('./middlewares/' + md)(options, app));
      debug('[middleware] loader %s middleware, option: %o', md, options);
    } catch(e) {
      debug('[middleware] loader error, error stack \n %s', e.stack);
    }
  });

  return app;
};
