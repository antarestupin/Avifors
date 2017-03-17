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

    this._initializeTypes();
  }

  _createClass(Avifors, [{
    key: 'setGenerator',
    value: function setGenerator(name, config) {
      var _this = this;

      config.outputs = config.outputs.map(function (i) {
        return typeof i === 'function' ? i : function (args) {
          return { path: _this.nunjucks.renderString(i.path, args), template: i.template };
        };
      });
      config.arguments = this.type.map(config.arguments);
      this.generators.push(_extends({
        name: name
      }, config));
    }
  }, {
    key: 'setCommand',
    value: function setCommand(name, command) {
      this.commands[name] = command;
    }
  }, {
    key: 'getCommand',
    value: function getCommand(name) {
      if (!name) {
        throw 'No command has been given.';
      }

      var command = this.commands[name];
      if (!command) {
        throw 'Command ' + name + ' does not exist.';
      }

      return command;
    }

    /**
     * @return [modelItem dict, list bool]
     */

  }, {
    key: 'getGenerator',
    value: function getGenerator(name) {
      var isList = false;
      var modelItem = this.generators.find(function (generator) {
        return generator.name === name;
      });
      if (modelItem !== undefined) {
        return [modelItem, isList];
      }

      isList = true;
      modelItem = this.generators.find(function (generator) {
        return generator.list === name;
      });
      if (modelItem !== undefined) {
        return [modelItem, isList];
      }

      throw 'Generator ' + name + ' not found.';
    }
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
  }, {
    key: '_initializeTypes',
    value: function _initializeTypes() {
      var _this3 = this;

      this.type = {
        mixed: function mixed() {
          return { type: 'mixed', normalize: function normalize() {
              return 'mixed';
            }, validate: function validate() {} };
        },
        list: function list(children) {
          return {
            type: 'list',
            children: children,
            normalize: function normalize() {
              return [children.normalize()];
            },
            validate: function validate(i, path) {
              assert(Array.isArray(i), path + ' must be a list, ' + i + ' given');
              i.every(function (v, j) {
                return children.validate(v, path + '[' + j + ']');
              });
            }
          };
        },
        map: function map(keys) {
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
              assert((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && !Array.isArray(i), path + ' must be a map, ' + i + ' given');
              for (var j in i) {
                assert(j in keys, 'Unexpected key "' + j + '" in ' + path);
                keys[j].validate(i[j], path + '.' + j);
              }
            }
          };
        },

        assert: assert
      };

      var basicTypes = ['string', 'number', 'boolean'];
      basicTypes.forEach(function (type) {
        return _this3.type[type] = function () {
          return {
            type: type,
            normalize: function normalize() {
              return type;
            },
            validate: function validate(i, path) {
              return assert((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === type, path + ' must be a ' + type + ', "' + i + '" given');
            }
          };
        };
      });
    }
  }]);

  return Avifors;
}();

exports.default = Avifors;


function assert(predicate, message) {
  if (!predicate) {
    throw message;
  }
}