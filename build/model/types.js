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
  var types = {};

  setListType(types, avifors);
  setMapType(types, avifors);
  setOneOfType(types, avifors);
  setBasicTypes(types, avifors);

  return types;
}

function setListType(types, avifors) {
  types.list = function (children) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$validators = _ref.validators,
        validators = _ref$validators === undefined ? [] : _ref$validators,
        _ref$builders = _ref.builders,
        builders = _ref$builders === undefined ? [] : _ref$builders;

    return {
      type: 'list',
      build: function build() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

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
        if (i == null) {
          return;
        }
        i.forEach(function (v, j) {
          return children.validate(v, path + '[' + j + ']');
        });
      }
    };
  };
}

function setMapType(types, avifors) {
  types.map = function (keys) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$validators = _ref2.validators,
        validators = _ref2$validators === undefined ? [] : _ref2$validators,
        _ref2$builders = _ref2.builders,
        builders = _ref2$builders === undefined ? [] : _ref2$builders,
        _ref2$defaults = _ref2.defaults,
        defaults = _ref2$defaults === undefined ? function () {
      return {};
    } : _ref2$defaults,
        _ref2$strict = _ref2.strict,
        strict = _ref2$strict === undefined ? true : _ref2$strict;

    return {
      type: 'map',
      build: function build() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var result = {};
        for (var i in keys) {
          result[i] = keys[i].build(value[i]);
        }
        result = Object.assign(defaults(result), result);
        builders.forEach(function (builder) {
          return result = builder(result);
        });
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
        avifors.assert(i == null || (typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && !Array.isArray(i), path + ' must be a map, ' + i + ' given');
        avifors.validate(validators, i, path);
        if (i == null) {
          return;
        }
        for (var j in i) {
          if (strict) {
            avifors.assert(j in keys, 'Unexpected key "' + j + '" in ' + path);
          }
          if (j in keys) {
            keys[j].validate(i[j], path + '.' + j);
          }
        }
      }
    };
  };
}

function setOneOfType(aTypes, avifors) {
  aTypes.oneOf = function (types, builder) {
    var getType = function getType(value) {
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      return types.find(function (t) {
        try {
          return t.validate(value, path) == undefined;
        } catch (e) {
          return false;
        }
      });
    };
    var getTypeIndex = function getTypeIndex(value) {
      return types.indexOf(getType(value));
    };

    return {
      type: 'oneOf',
      build: function build(value) {
        var typeIndex = getTypeIndex(value);
        return types[typeIndex].build(builder(value, typeIndex));
      },
      normalize: function normalize() {
        return { 'one of': types.map(function (i) {
            return i.normalize();
          }) };
      },
      validate: function validate(i, path) {
        return avifors.assert(getType(i, path) !== undefined, 'Could not resolve ' + path + ': no type could validate given value');
      }
    };
  };
}

function setBasicTypes(types, avifors) {
  var basicTypes = ['string', 'number', 'boolean'];
  var buildBasicType = function buildBasicType(type) {
    return function () {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$validators = _ref3.validators,
          validators = _ref3$validators === undefined ? [] : _ref3$validators,
          _ref3$builders = _ref3.builders,
          builders = _ref3$builders === undefined ? [] : _ref3$builders;

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
    return types[type] = buildBasicType(type);
  });
}