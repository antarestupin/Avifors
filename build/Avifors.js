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
    var _this = this;

    _classCallCheck(this, Avifors);

    this.generators = [];

    var emptyDicts = ['command', 'type', 'validator'];
    emptyDicts.forEach(function (i) {
      return _this._createProperty(i);
    });

    this.nunjucks = _nunjucks2.default.configure({
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true
    });
  }

  /**
   * Set a generator
   */


  _createClass(Avifors, [{
    key: 'setGenerator',
    value: function setGenerator(name, config) {
      var _this2 = this;

      config.outputs = config.outputs.map(function (i) {
        return typeof i === 'function' ? i : function (args) {
          return { path: _this2.nunjucks.renderString(i.path, args), template: i.template };
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
      var _this3 = this;

      paths.map(function (path) {
        return _glob2.default.sync(path, { nodir: true, absolute: true });
      }) // get the list of files matching given pattern
      .reduce(function (a, b) {
        return a.concat(b);
      }) // flatten it to one list
      .forEach(function (pluginPath) {
        return require(pluginPath).default(_this3);
      });
    }

    /**
     * Create an empty dict property with its getter, setter and hasser
     * Example: _createProperty('command') => this.commands = {}; this.getCommand(name); this.setCommand(name, command); this.hasCommand(name)
     */

  }, {
    key: '_createProperty',
    value: function _createProperty(field) {
      var _this4 = this;

      var uppercased = field.charAt(0).toUpperCase() + field.substr(1);
      var plural = field + 's';
      this[plural] = {};
      this['set' + uppercased] = function (name, value) {
        return _this4[plural][name] = value;
      };
      this['get' + uppercased] = function (name) {
        if (!_this4['has' + uppercased](name)) {
          throw uppercased + ' ' + name + ' does not exist.';
        }
        return _this4[plural][name];
      };
      this['has' + uppercased] = function (name) {
        return _this4[plural][name] !== undefined;
      };
    }
  }]);

  return Avifors;
}();

exports.default = Avifors;