'use strict';

var app = require('..')({
  proxyUrl: false,
  cwd: process.cwd()
});

var request = require('supertest');

app.post('/test', function* () {
  var body = this.request.body;
  console.log(this.request, this.query);
  console.log('response body: ' + body);
  this.body = body;
});

describe('something', function(){
  it('should work', function(done){
    request(app.callback())
      .post('/test')
      .set('Accept', 'application/json')
      .send({ a: '1', b: '2' })
      // .field('a', '1')
      // .expect({ a: '1' })
      .expect(200, done);
  });
});
