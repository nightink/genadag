'use strict';

// middleware list options
module.exports = function(program) {
  return {
    cdnProxy: {
      proxyUrl: program.proxyUrl
    },
    markdown: {
      root: process.cwd(),
      baseUrl: process.cwd(),
      cache: program.cache,
      markedOpts: {
        gfm: true,
        highlight: function (code) {
          return require('highlight.js').highlightAuto(code).value;
        }
      }
    }
  };
};
