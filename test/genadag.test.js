'use strict';

var debug = require('debug')('ss:test');
var request = require('supertest');

const baseDir = process.cwd();
var app = require('..')({
  proxyUrl: false,
  baseDir,
});

describe('genadag', function(){
  before(function() {
    app.post('/test', function* () {
      var body = this.request.body;
      debug('response body: %o', body);
      this.body = body;
    });

    app.get('/query', function* () {
      this.body = this.query;
    });
  });

  it('should work', function(done){
    request(app.callback())
      .post('/test')
      .set('Accept', 'application/json')
      .send({ a: '1' })
      .expect({ a: '1' })
      .expect(200, done);
  });

  it('querystring work', function(done) {
    request(app.callback())
      .get('/query')
      .query('key=1&keys[]=a&keys[]=b')
      .expect({
        key: ['1'],
        'keys[]': ['a', 'b']
      })
      .expect(200, done);
  });
});
