"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBuilders = getBuilders;
/**
 * Core builders
 */
function getBuilders(avifors) {
  var builders = {
    mapDefault: function mapDefault(defaultFn) {
      return function (value) {
        return Object.assign(defaultFn(value), value);
      };
    }
  };

  return builders;
}