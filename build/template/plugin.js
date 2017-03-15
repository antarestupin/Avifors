'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (avifors) {
  for (var i in _filters.filters) {
    avifors.nunjucks.addFilter(i, _filters.filters[i]);
  }

  for (var _i in _functions.functions) {
    avifors.nunjucks.addGlobal(_i, _functions.functions[_i]);
  }
};

var _filters = require('./filters');

var _functions = require('./functions');