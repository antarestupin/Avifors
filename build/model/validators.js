'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidators = getValidators;
/**
 * Core validators
 */
function getValidators(avifors) {
  var validators = {
    required: function required() {
      return {
        normalize: function normalize() {
          return 'required';
        },
        validate: function validate(i, path) {
          return avifors.assert(i != null, path + ' must be defined');
        }
      };
    }
  };

  return validators;
}