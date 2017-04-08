'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getTypes = getTypes;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Core types
 */
function getTypes(avifors) {
  var types = {
    list: function list(children) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$validators = _ref.validators,
          validators = _ref$validators === undefined ? [] : _ref$validators,
          _ref$builders = _ref.builders,
          builders = _ref$builders === undefined ? [] : _ref$builders;

      return {
        type: 'list',
        build: function build(value) {
          var result = value.map(function (i) {
            return children.build(i);
          });
          builders.forEach(function (builder) {
            return result = builder(result);
          });
          return result;
        },
        normalize: function normalize() {
          return [children.normalize()];
        },
        validate: function validate(i, path) {
          avifors.assert(i == null || Array.isArray(i), path + ' must be a list, ' + i + ' given');
          avifors.validate(validators, i, path);
          i.forEach(function (v, j) {
            return children.validate(v, path + '[' + j + ']');
          });
        }
      };
    },

    optional: {}
  };

  setMapTypes(types, avifors);
  setBasicTypes(types, avifors);

  return types;
}

function setMapTypes(types, avifors) {
  var _build = function _build(keys, builders) {
    return function (value) {
      var result = {};
      for (var i in keys) {
        result[i] = keys[i].build(value[i]);
      }
      builders.forEach(function (builder) {
        return result = builder(result);
      });
      return result;
    };
  };

  var normalize = function normalize(keys) {
    return function () {
      var result = {};
      for (var i in keys) {
        result[i] = keys[i].normalize();
      }
      return result;
    };
  };

  var _validate = function _validate(keys, validators) {
    return function (i, path) {
      avifors.assert(i == null || (typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && !Array.isArray(i), path + ' must be a map, ' + i + ' given');
      avifors.validate(validators, i, path);
      for (var j in i) {
        avifors.assert(j in keys, 'Unexpected key "' + j + '" in ' + path);
        keys[j].validate(i[j], path + '.' + j);
      }
    };
  };

  types.map = function (keys) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$validators = _ref2.validators,
        validators = _ref2$validators === undefined ? [] : _ref2$validators,
        _ref2$builders = _ref2.builders,
        builders = _ref2$builders === undefined ? [] : _ref2$builders;

    return {
      type: 'map',
      build: _build(keys, builders),
      normalize: normalize(keys),
      validate: _validate(keys, validators)
    };
  };

  var buildMethod = function buildMethod(value, defaultKey, fn) {
    return ['string', 'number', 'boolean'].indexOf(typeof value === 'undefined' ? 'undefined' : _typeof(value)) > -1 ? fn(_defineProperty({}, defaultKey, value)) : fn(value);
  };

  types.valueOrMap = function (defaultKey, keys) {
    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref3$validators = _ref3.validators,
        validators = _ref3$validators === undefined ? [] : _ref3$validators,
        _ref3$builders = _ref3.builders,
        builders = _ref3$builders === undefined ? [] : _ref3$builders;

    return {
      type: 'value-or-map',
      build: function build(value) {
        return buildMethod(value, defaultKey, _build(keys, builders));
      },
      normalize: normalize(keys),
      validate: function validate(value) {
        return buildMethod(value, defaultKey, _validate(keys, validators));
      }
    };
  };
}

function setBasicTypes(types, avifors) {
  var basicTypes = ['string', 'number', 'boolean'];
  var buildBasicType = function buildBasicType(type, optional) {
    return function () {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$validators = _ref4.validators,
          validators = _ref4$validators === undefined ? [] : _ref4$validators,
          _ref4$builders = _ref4.builders,
          builders = _ref4$builders === undefined ? [] : _ref4$builders;

      if (!optional) {
        validators.push(avifors.validators.required());
      }

      return {
        type: type,
        build: function build(value) {
          var result = value;
          builders.forEach(function (builder) {
            return result = builder(result);
          });
          return result;
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
}