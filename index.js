#!/usr/bin/env node --harmony

'use strict';

var join = require('path').join;

var koa = require('koa');
var ks = require('koa-static');

var program = require('commander');
program
  .option('-c, --no-cache', 'cache markdown html')
  .option('-u, --proxyUrl', 'static proxy url')
  .option('-p, --port [port]', 'serve port', Number, 3000)
  .parse(process.argv);

var middlewares = require('./middlewares')(program);

var ss = koa();
ss.use(ks(process.cwd()));
// loader middleware
for(var md in middlewares) {
  try {
    var options = middlewares[md];
    ss.use(require('./middlewares/' + md)(options, ss));
    console.log('[middleware] loader %s middleware, option ', md, options);
  } catch(e) {
    console.error('[middleware] loader error, error stack \n %s', e.stack);
  }
}

ss.listen(program.port, function() {
  console.log('server start. port: %s', program.port);
});
