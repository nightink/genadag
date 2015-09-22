'use strict';

var join = require('path').join;

var debug = require('debug')('ss');
var koa = require('koa');
var Router = require('koa-router');

var app = koa();
var routerMiddleware = new Router(app);

routerMiddleware.methods.push('HEAD');
app.use(routerMiddleware.middleware());

app.get('/', function* () {
  this.body = '/';
});

app.get('/a', function* () {
  this.body = 'a';
});

app.redirect('/b', 'www.baidu.com', 302);

app.listen(3000);
