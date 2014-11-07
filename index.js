#!/usr/bin/env node --harmony

'use strict';

var join = require('path').join;

var koa = require('koa');
var ks = require('koa-static');
var markdown = require('./middlewares/md');
var cdnProxy = require('./middlewares/cdnProxy');

var program = require('commander');
program
  .option('-c, --no-cache', 'cache markdown html')
  .option('-u, --proxyUrl', 'static proxy url')
  .option('-p, --port [port]', 'serve port', Number, 3000)
  .parse(process.argv);

var ss = koa();
ss.use(cdnProxy({
  proxyUrl: program.proxyUrl
}));
ss.use(ks(process.cwd()));
ss.use(markdown({
  root: process.cwd(),
  baseUrl: process.cwd(),
  cache: program.cache,
  markedOpts: {
    gfm: true,
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  }
}));

ss.listen(program.port, function() {
  console.log('server start.');
});
