'use strict';

var debug = require('debug')('ss:test:fixtures:server');

var app = require('../../');

app.get('/', function* () {
  this.body = '/';
});

app.get('/a', function* () {
  this.body = 'a';
});

app.redirect('/b', 'www.baidu.com', 302);

app.listen(3000);

app.ready(function() {
  app.listen(3000, function() {
    console.log('server start. port: %s', 3000);
  });
});
