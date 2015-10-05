'use strict';

const join = require('path').join;

const debug = require('debug')('ss');
const koa = require('koa');
const staticify = require('koa-static');
const Router = require('koa-router');
const qs = require('koa-qs');
const ready = require('koa-ready');
const bodyParser = require('koa-bodyparser');

module.exports = function(program) {
  const app = koa();

  ready(app);
  qs(app, 'strict');
  app.use(staticify(program.baseDir));
  app.use(bodyParser());

  const middlewares = require('./middlewares')(program);
  // loader middleware
  Object.keys(middlewares).forEach(function(mdw) {
    debug('[middleware] loader middleware id %s', mdw);

    try {
      const options = middlewares[mdw];
      app.use(require('./middlewares/' + mdw)(options, app));
      debug('[middleware] loader %s middleware option: %o', mdw, options);
    } catch(err) {
      debug('[middleware] loader error, error stack \n %s', err.stack);
    }
  });

  const router = new Router(app);
  router.methods.push('HEAD');
  app.use(router.middleware());

  return app;
};
