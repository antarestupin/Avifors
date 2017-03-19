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

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Avifors = function () {
  function Avifors() {
    var _this = this;

    _classCallCheck(this, Avifors);

    this.generators = [];
    this.model = null; // will be defined by the model builder

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

      this._checkSetGeneratorArguments(name, config);

      if (_checkTypes2.default.array(config.outputs)) {
        var outputs = config.outputs.map(function (i) {
          return typeof i === 'function' ? i : function (args) {
            return { path: _this2.nunjucks.renderString(i.path, args), template: i.template };
          };
        });
        config.outputs = function () {
          return outputs;
        };
      }
      config.arguments = this.types.map(config.arguments);
      this.generators.push(_extends({
        name: name
      }, config));
    }
  }, {
    key: '_checkSetGeneratorArguments',
    value: function _checkSetGeneratorArguments(name, config) {
      var _this3 = this;

      var badCallExceptionMessage = function badCallExceptionMessage(msg) {
        return _chalk2.default.cyan('Avifors.setGenerator(\'' + name + '\', config):') + ' ' + msg;
      };
      this.assert(_checkTypes2.default.nonEmptyString(name), badCallExceptionMessage('Generator name must be an non empty string'));
      this.assert(_checkTypes2.default.nonEmptyObject(config), badCallExceptionMessage('config must be an non empty object and contain at least \'arguments\' and \'outputs\''));
      this.assert(_checkTypes2.default.maybe.nonEmptyString(config.list), badCallExceptionMessage('config.list must be a non empty string'));
      this.assert(_checkTypes2.default.maybe.nonEmptyString(config.key), badCallExceptionMessage('config.key must be a non empty string'));
      this.assert(_checkTypes2.default.object(config.arguments), badCallExceptionMessage('config.key must be a non empty object'));
      if (_checkTypes2.default.array(config.outputs)) {
        config.outputs.forEach(function (i, index) {
          return _this3.assert(_checkTypes2.default.function(i) || _checkTypes2.default.object(i) && _checkTypes2.default.nonEmptyString(i.path) && _checkTypes2.default.nonEmptyString(i.template), badCallExceptionMessage('config.key[' + index + '] must be an object containing non empty strings \'path\' and \'template\' or a function returning the above object'));
        });
      } else {
        this.assert(_checkTypes2.default.function(config.outputs), badCallExceptionMessage('config.outputs must be an array or a function returning an array of outputs'));
      }
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
     * Set the model once it's built
     */

  }, {
    key: 'setModel',
    value: function setModel(model) {
      this.model = model;
      this.nunjucks.addGlobal('model', model);
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
      var _this4 = this;

      paths.map(function (path) {
        return _glob2.default.sync(path, { nodir: true, absolute: true });
      }) // get the list of files matching given pattern
      .reduce(function (a, b) {
        return a.concat(b);
      }) // flatten it to one list
      .forEach(function (pluginPath) {
        return require(pluginPath).default(_this4);
      });
    }

    /**
     * Create an empty dict property with its getter, setter and hasser
     * Example: _createProperty('command') => this.commands = {}; this.getCommand(name); this.setCommand(name, command); this.hasCommand(name)
     */

  }, {
    key: '_createProperty',
    value: function _createProperty(field) {
      var _this5 = this;

      var uppercased = field.charAt(0).toUpperCase() + field.substr(1);
      var plural = field + 's';
      this[plural] = {};
      this['set' + uppercased] = function (name, value) {
        return _this5[plural][name] = value;
      };
      this['get' + uppercased] = function (name) {
        if (!_this5['has' + uppercased](name)) {
          throw uppercased + ' ' + name + ' does not exist.';
        }
        return _this5[plural][name];
      };
      this['has' + uppercased] = function (name) {
        return _this5[plural][name] !== undefined;
      };
    }
  }]);

  return Avifors;
}();

exports.default = Avifors;