'use strict';

const cluster = require('cluster');
const graceful = require('graceful');
const program = require('commander');

program
  .option('--no-cache', 'cache markdown html')
  .option('--proxyUrl [url]', 'static proxy url')
  .option('--port [port]', 'serve port', Number, 8001)
  .option('--baseDir [path]', 'base dir')
  .parse(process.argv);

const startDate = Date.now();
const app = require('../index')(program);

const port = program.port;
const baseDir = program.baseDir;
process.title = `genadag work ${cluster.worker.id} --port=${port} --baseDir=${baseDir}`;

app.ready(function() {
  console.log('[work] %s server ready.', cluster.worker.id);

  const server = require('http').createServer(app.callback());
  server.listen(port, function() {
    console.log('[work] %s started (%sms)', cluster.worker.id, Date.now() - startDate);
  });

  graceful({
    server: [server],
    error: function(err, throwErrorCount) {
      if (err.message) {
        err.message += ` (uncaughtException throw ${throwErrorCount} times on pid:${process.pid})`;
      }
      console.log(err);
    }
  })
});
