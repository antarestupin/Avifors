'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Avifors = function () {
  function Avifors() {
    _classCallCheck(this, Avifors);

    this.generators = [];
    this.commands = {};

    this.nunjucks = _nunjucks2.default.configure({
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true
    });

    this._initializeValidators();
    this._initializeTypes();
  }

  /**
   * Set a generator
   */


  _createClass(Avifors, [{
    key: 'setGenerator',
    value: function setGenerator(name, config) {
      var _this = this;

      config.outputs = config.outputs.map(function (i) {
        return typeof i === 'function' ? i : function (args) {
          return { path: _this.nunjucks.renderString(i.path, args), template: i.template };
        };
      });
      config.arguments = this.types.map(config.arguments);
      this.generators.push(_extends({
        name: name
      }, config));
    }

    /**
     * Get the generator defined with given name, and say if given name refers to a list of items
     * @return [generator dict, list bool]
     */

  }, {
    key: 'getGenerator',
    value: function getGenerator(name) {
      var isList = false;
      var generator = this.generators.find(function (gen) {
        return gen.name === name;
      });
      if (generator !== undefined) {
        return [generator, isList];
      }

      isList = true;
      generator = this.generators.find(function (gen) {
        return gen.list === name;
      });
      if (generator !== undefined) {
        return [generator, isList];
      }

      throw 'Generator ' + name + ' not found.';
    }

    /**
     * Set a command
     */

  }, {
    key: 'setCommand',
    value: function setCommand(name, command) {
      this.commands[name] = command;
    }

    /**
     * Get the command defined with given name
     */

  }, {
    key: 'getCommand',
    value: function getCommand(name) {
      var command = this.commands[name];
      if (!command) {
        throw 'Command ' + name + ' does not exist.';
      }

      return command;
    }

    /**
     * Quick way to assert a predicate
     */

  }, {
    key: 'assert',
    value: function assert(predicate, message) {
      if (!predicate) {
        throw message;
      }
    }

    /**
     * Validate given item using given validators
     */

  }, {
    key: 'validate',
    value: function validate(validators, item, path) {
      validators.forEach(function (v) {
        return v.validate(item, path);
      });
    }

    /**
     * Load plugins at given paths
     */

  }, {
    key: 'loadPlugins',
    value: function loadPlugins(paths) {
      var _this2 = this;

      paths.map(function (path) {
        return _glob2.default.sync(path, { nodir: true, absolute: true });
      }) // get the list of files matching given pattern
      .reduce(function (a, b) {
        return a.concat(b);
      }) // flatten it to one list
      .forEach(function (pluginPath) {
        return require(pluginPath).default(_this2);
      });
    }

    /**
     * Add core types
     */

  }, {
    key: '_initializeTypes',
    value: function _initializeTypes() {
      var _this3 = this;

      this.types = {
        mixed: function mixed() {
          var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          return { type: 'mixed', normalize: function normalize() {
              return 'mixed';
            }, validate: function validate(i, path) {
              return _this3.validate(validators, i, path);
            } };
        },

        list: function list(children) {
          var validators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
          return {
            type: 'list',
            children: children,
            normalize: function normalize() {
              return [children.normalize()];
            },
            validate: function validate(i, path) {
              _this3.assert(Array.isArray(i), path + ' must be a list, ' + i + ' given');
              _this3.validate(validators, i, path);
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
            keys: keys,
            normalize: function normalize() {
              var result = {};
              for (var i in keys) {
                result[i] = keys[i].normalize();
              }
              return result;
            },
            validate: function validate(i, path) {
              _this3.assert((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && !Array.isArray(i), path + ' must be a map, ' + i + ' given');
              _this3.validate(validators, i, path);
              for (var j in i) {
                _this3.assert(j in keys, 'Unexpected key "' + j + '" in ' + path);
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
            validators.push(_this3.validators.required());
          }

          return {
            type: type,
            normalize: function normalize() {
              return type + (validators.length ? ' (' + validators.map(function (v) {
                return v.normalize();
              }).join(', ') + ')' : '');
            },
            validate: function validate(i, path) {
              _this3.assert((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === type || i == null, path + ' must be a ' + type + ', "' + i + '" given');
              _this3.validate(validators, i, path);
            }
          };
        };
      };

      basicTypes.forEach(function (type) {
        _this3.types[type] = buildBasicType(type, false);
        _this3.types.optional[type] = buildBasicType(type, true);
      });
    }

    /**
     * Add core validators
     */

  }, {
    key: '_initializeValidators',
    value: function _initializeValidators() {
      var _this4 = this;

      this.validators = {
        required: function required() {
          return {
            normalize: function normalize() {
              return 'required';
            },
            validate: function validate(i, path) {
              return _this4.assert(i != null, path + ' must be defined');
            }
          };
        }
      };
    }
  }]);

  return Avifors;
}();

exports.default = Avifors;