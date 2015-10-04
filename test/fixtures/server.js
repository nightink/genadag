'use strict';

var debug = require('debug')('ss:test:fixtures:server');

var app = require('../../')({
  cwd: process.cwd()
});

app.get('/', function* () {
  this.body = '/';
});

app.get('/a', function* () {
  this.body = 'a';
});

app.redirect('/b', 'www.baidu.com', 302);

app.ready(function() {
  console.log('[work] server ready.');
  app.listen(8001, function() {
    console.log('[work] server start. port: %s', 8001);
  });
});
