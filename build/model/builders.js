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
    mapDefaultValues: function mapDefaultValues(defaultFn) {
      return function (value) {
        return Object.assign(defaultFn(value), value);
      };
    }
  };

  return builders;
}