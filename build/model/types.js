'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getTypes = getTypes;
/**
 * Core types
 */
function getTypes(avifors) {
  var types = {
    scalar: function scalar() {
      var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return {
        type: 'scalar',
        build: function build(value) {
          return value;
        },
        normalize: function normalize() {
          return 'scalar';
        },
        validate: function validate(i, path) {
          return avifors.validate(validators, i, path);
        }
      };
    },

    list: function list(children) {
      var validators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return {
        type: 'list',
        build: function build(value) {
          return value.map(function (i) {
            return children.build(i);
          });
        },
        normalize: function normalize() {
          return [children.normalize()];
        },
        validate: function validate(i, path) {
          avifors.assert(Array.isArray(i), path + ' must be a list, ' + i + ' given');
          avifors.validate(validators, i, path);
          i.forEach(function (v, j) {
            return children.validate(v, path + '[' + j + ']');
          });
        }
      };
    },

    map: function map(keys) {
      var validators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return {
        type: 'map',
        build: function build(value) {
          var result = {};
          for (var i in keys) {
            result[i] = keys[i].build(value[i]);
          }
          return result;
        },
        normalize: function normalize() {
          var result = {};
          for (var i in keys) {
            result[i] = keys[i].normalize();
          }
          return result;
        },
        validate: function validate(i, path) {
          avifors.assert((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && !Array.isArray(i), path + ' must be a map, ' + i + ' given');
          avifors.validate(validators, i, path);
          for (var j in i) {
            avifors.assert(j in keys, 'Unexpected key "' + j + '" in ' + path);
          }for (var _j in keys) {
            keys[_j].validate(i[_j], path + '.' + _j);
          }
        }
      };
    },

    optional: {}
  };

  // Basic types
  var basicTypes = ['string', 'number', 'boolean'];
  var buildBasicType = function buildBasicType(type, optional) {
    return function () {
      var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!optional) {
        validators.push(avifors.validators.required());
      }

      return {
        type: type,
        build: function build(value) {
          return value;
        },
        normalize: function normalize() {
          return type + (validators.length ? ' (' + validators.map(function (v) {
            return v.normalize();
          }).join(', ') + ')' : '');
        },
        validate: function validate(i, path) {
          avifors.assert((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === type || i == null, path + ' must be a ' + type + ', "' + i + '" given');
          avifors.validate(validators, i, path);
        }
      };
    };
  };

  basicTypes.forEach(function (type) {
    types[type] = buildBasicType(type, false);
    types.optional[type] = buildBasicType(type, true);
  });

  return types;
}