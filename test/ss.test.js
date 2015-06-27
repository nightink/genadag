'use strict';

var debug = require('debug')('ss:test');
var request = require('supertest');

var app = require('..')({
  proxyUrl: false,
  cwd: process.cwd()
});

app.post('/test', function* () {
  var body = this.request.body;
  debug('response body: %o', body);
  this.body = body;
});

describe('something', function(){
  it('should work', function(done){
    request(app.callback())
      .post('/test')
      .set('Accept', 'application/json')
      // .send({ a: '1', b: '2' })
      .field('a', '1')
      .expect({ a: '1' })
      .expect(200, done);
  });
});
