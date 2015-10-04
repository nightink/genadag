'use strict';

// middleware list options
module.exports = function(program) {
  return {
    cdn_proxy: {
      proxyUrl: program.proxyUrl
    },
    powered_by: true,
    markdown: {
      root: program.cwd,
      baseUrl: program.cwd,
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
