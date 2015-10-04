'use strict';

const graceful = require('graceful');
const program = require('commander');

program
  .option('--no-cache', 'cache markdown html')
  .option('--proxyUrl [url]', 'static proxy url')
  .option('--port [port]', 'serve port', Number, 8001)
  .option('--baseDir [path]', 'base dir')
  .parse(process.argv);

program.cwd = process.cwd();

var app = require('../index')(program);

app.ready(function() {
  console.log('[work] server ready.');
  const server = require('http').createServer(app.callback());
  server.listen(program.port, function() {
    console.log('[work] server start. port: %s', program.port);
  });

  graceful({
    server: [server],
    error: function(err, errCount) {
      if (err.message) {
        err.message += ` (uncaughtException throw ${throwErrorCount} times on pid:${process.pid})`;
      }
      console.log(err);
    }
  })
});
