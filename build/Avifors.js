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

var _YamlHelper = require('./tools/YamlHelper');

var _YamlHelper2 = _interopRequireDefault(_YamlHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Avifors = function () {
  function Avifors() {
    var _this = this;

    _classCallCheck(this, Avifors);

    this.generators = [];
    this.autoGenerators = [];
    this.autoGeneratorBuilders = [];
    this.constructors = {};
    this.model = null; // will be defined by the model builder

    var assertArg = function assertArg(value, cond, fnName, msg) {
      return _this.assert(cond, 'avifors.' + fnName + '(): ' + msg + ', ' + value + ' provided');
    };
    var emptyDicts = ['command', 'type', 'validator', 'builder'];
    emptyDicts.forEach(function (i) {
      return _this._createProperty(i, function (commandName, value) {
        return assertArg(value, _checkTypes2.default.function(value), commandName, 'the ' + i + ' must be a function');
      });
    });

    this._createProperty('query', function (commandName, value) {
      assertArg(value, _checkTypes2.default.nonEmptyObject(value), commandName, 'the query must be an object');
      assertArg(value, _checkTypes2.default.maybe.string(value.description), commandName, 'query.description must be a string');
      assertArg(value, _checkTypes2.default.maybe.array(value.arguments), commandName, 'query.arguments must be an array');
      assertArg(value, _checkTypes2.default.function(value.resolve), commandName, 'query.resolve must be a function');
    }, 'queries');

    this.nunjucks = _nunjucks2.default.configure({
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true
    });

    this.helpers = {
      printYaml: function printYaml(obj) {
        return console.log(new _YamlHelper2.default().print(obj));
      }
    };
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
     * Add a generator that will be executed without model definition
     * @param builder: model => [{path: string, template: string, variables: {}}]
     */

  }, {
    key: 'addAutoGenerator',
    value: function addAutoGenerator(builder) {
      this.assert(_checkTypes2.default.function(builder), 'avifors.addAutoGenerator(builder): builder must be a function, ' + builder + ' provided');
      this.autoGeneratorBuilders.push(builder);
    }

    /**
     * Set the model once it's built
     */

  }, {
    key: 'setModel',
    value: function setModel(model) {
      this.model = model;
      this.nunjucks.addGlobal('model', model);
      this.autoGenerators = this.autoGeneratorBuilders.map(function (i) {
        return i(model);
      });
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

      this.assert(_checkTypes2.default.array(paths), 'loadPlugins(paths): paths must be an array of strings, ' + paths + ' provided');
      paths.forEach(function (i, index) {
        return _this4.assert(_checkTypes2.default.string(i), 'loadPlugins(paths): every path must be a string, ' + i + ' provided');
      });

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

      var validator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var pluralForm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var uppercased = field.charAt(0).toUpperCase() + field.substr(1);
      var plural = pluralForm ? pluralForm : field + 's';
      this[plural] = {};
      this['set' + uppercased] = function (name, value) {
        validator('set' + uppercased, value);
        _this5[plural][name] = value;
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