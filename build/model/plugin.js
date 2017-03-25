'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (avifors) {
  var types = (0, _types.getTypes)(avifors);
  for (var i in types) {
    avifors.setType(i, types[i]);
  }

  var validators = (0, _validators.getValidators)(avifors);
  for (var _i in validators) {
    avifors.setValidator(_i, validators[_i]);
  }

  var builders = (0, _builders.getBuilders)(avifors);
  for (var _i2 in builders) {
    avifors.setBuilder(_i2, builders[_i2]);
  }
};

var _types = require('./types');

var _validators = require('./validators');

var _builders = require('./builders');