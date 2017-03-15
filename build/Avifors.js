'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

    this.type = {
      string: function string() {
        return { type: 'string', normalize: function normalize() {
            return 'string';
          } };
      },
      number: function number() {
        return { type: 'number', normalize: function normalize() {
            return 'number';
          } };
      },
      boolean: function boolean() {
        return { type: 'boolean', normalize: function normalize() {
            return 'boolean';
          } };
      },
      mixed: function mixed() {
        return { type: 'mixed', normalize: function normalize() {
            return 'mixed';
          } };
      },
      list: function list(children) {
        return {
          type: 'list',
          children: children,
          normalize: function normalize() {
            return [children.normalize()];
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
          }
        };
      }
    };
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
  }]);

  return Avifors;
}();

exports.default = Avifors;