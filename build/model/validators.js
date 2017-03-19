'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidators = getValidators;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    },

    enum: function _enum(values) {
      return {
        normalize: function normalize() {
          return 'enum[' + values.join(', ') + ']';
        },
        validate: function validate(i, path) {
          return avifors.assert(values.indexOf(i) !== -1, path + ' value should be one the following: ' + values.map(function (i) {
            return _chalk2.default.green(i);
          }).join(', ') + '; "' + _chalk2.default.magenta(i) + '" given');
        }
      };
    }
  };

  return validators;
}