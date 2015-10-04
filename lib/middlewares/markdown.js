'use strict';

const debug = require('debug')('ss:middlewares:markdown');
const markdownIt = require('markdown-it');
const fs = require('co-fs');

const path = require('path');
const assert = require('assert');

const cachePages = {};

module.exports = function(options, app) {
  assert(options && options.root, 'options.root required');

  options.layout = options.layout || path.join(__dirname, 'layout.html');
  options.cache = !!options.cache;
  options.titleHolder = options.titleHolder || '{title}';
  options.bodyHolder = options.bodyHolder || '{body}';
  options.indexName = options.indexName || 'index';

  let md;
  if (options.markedOpts) {
    md = markdownIt(options.markedOpts);
  }

  function* getPage(filepath) {
    if (options.cache && filepath in cachePages) {
      return cachePages[filepath];
    }

    let r;
    try {
      r = yield [getLayout(), getContent(filepath)];
    } catch (err) {
      if (err.code === 'ENOENT') {
        debug('error stack %j', err.stack);
        return null;
      }
      throw err;
    }

    const layout = r[0];
    const content = r[1];
    const html = layout
      .replace(options.titleHolder, content.title)
      .replace(options.bodyHolder, content.body);

    if (options.cache) {
      cachePages[filepath] = html;
    }
    return html;
  }

  let cacheLayout;
  function* getLayout() {
    if (options.cache && cacheLayout) {
      return cacheLayout;
    }
    const layout = yield fs.readFile(options.layout, 'utf8');
    cacheLayout = layout;
    return layout;
  }

  function* getContent(filepath) {
    const content = yield fs.readFile(filepath, 'utf8');
    const title = content.slice(0, content.indexOf('\n')).trim()
      .replace(/^[#\s]+/, '')
      .replace(/<[^>]+>/g, '');

    const body = md.render(content);

    return {
      title: title,
      body: body
    };
  }

  return function* markdown(next) {
    if (this.method !== 'GET' || this.path === '/favicon.ico') {
      return yield next;
    }

    const pathname = path.join(options.root, this.path + '.md');
    // generate html
    const html = yield getPage(pathname);

    if (html === null) {
      return yield next;
    }

    this.type = 'html';
    this.body = html;
  };
};
