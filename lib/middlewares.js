'use strict';

const hljs = require('highlight.js')

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
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (__) {}
          }

          try {
            return hljs.highlightAuto(str).value;
          } catch (__) {}

          return ''; // use external default escaping
        }
      }
    }
  };
};
