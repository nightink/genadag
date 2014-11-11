
'use strict';

/**
 * Module dependencies.
 */

var marked = require('marked');
var path = require('path');
var fs = require('co-fs');

var cachePages = {};
var cacheLayout;

module.exports = function getPage(options, app) {
  if (!options || !options.root || !options.baseUrl) {
    throw new Error('options.root and options.baseUrl required');
  }

  options.baseUrl = options.baseUrl.replace(/\/$/, '');
  options.layout = options.layout || path.join(__dirname, 'layout.html');
  options.cache = options.cache === false ? false : true;
  options.titleHolder = options.titleHolder || '{title}';
  options.bodyHolder = options.bodyHolder || '{body}';
  options.indexName = options.indexName || 'index';

  if (options.markedOpts) {
    marked.setOptions(options.markedOpts);
  }

  function * getPage(filepath) {
    if (options.cache && filepath in cachePages) {
      return cachePages[filepath];
    }
    var r;
    try {
      r = yield [getLayout(), getContent(filepath)];
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(err);
        return null;
      }
      throw err;
    }

    var layout = r[0];
    var content = r[1];
    var html = layout.replace(options.titleHolder, content.title)
      .replace(options.bodyHolder, content.body);

    if (options.cache) {
      cachePages[filepath] = html;
    }
    return html;
  }

  function * getLayout() {
    if (options.cache && cacheLayout) {
      return cacheLayout;
    }
    var layout = yield fs.readFile(options.layout, 'utf8');
    cacheLayout = layout;
    return layout;
  }

  function * getContent(filepath) {
    var content = yield fs.readFile(filepath, 'utf8');
    var title = content.slice(0, content.indexOf('\n')).trim()
                  .replace(/^[#\s]+/, '')
                  .replace(/<[^>]+>/g, '');
    var body = marked(content);
    return {
      title: title,
      body: body
    };
  }

  return function * markdown(next) {
    if (this.method !== 'GET' || this.path === '/favicon.ico') {
      return yield next;
    }

    var pathname = path.join(options.root, this.path + '.md');
    // generate html
    var html = yield getPage(pathname);
    if (html === null) {
      return yield next;
    }
    this.type = 'html';
    this.body = html;
  };
};
