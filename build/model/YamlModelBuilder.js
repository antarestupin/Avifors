'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YamlModelBuilder = function () {
  function YamlModelBuilder(avifors, yamlHelper) {
    _classCallCheck(this, YamlModelBuilder);

    this.avifors = avifors;
    this.yamlHelper = yamlHelper;
  }

  _createClass(YamlModelBuilder, [{
    key: 'build',
    value: function build(paths) {
      var _this = this;

      return paths.map(function (path) {
        return _glob2.default.sync(path, { nodir: true });
      }) // get the list of files matching given pattern
      .reduce(function (a, b) {
        return a.concat(b);
      }) // flatten it to one list
      .map(function (path) {
        return _this.yamlHelper.readYamlFile(path);
      }).map(function (modelConfig) {
        return _this._normalizeModelConfig(modelConfig);
      }).reduce(function (a, b) {
        return a.concat(b);
      });
    }

    /**
     * entities:
     *   User:
     *     properties: ...
     *
     * => [
     *   {
     *     type: 'entity',
     *     arguments: {
     *       name: 'User',
     *       properties: ...
     *     }
     *   }
     * ]
     */

  }, {
    key: '_normalizeModelConfig',
    value: function _normalizeModelConfig(modelConfig) {
      var _this2 = this;

      var name = Object.keys(modelConfig)[0];

      var _avifors$getGenerator = this.avifors.getGenerator(name),
          _avifors$getGenerator2 = _slicedToArray(_avifors$getGenerator, 2),
          generator = _avifors$getGenerator2[0],
          isList = _avifors$getGenerator2[1];

      if (isList) {
        // if the key is used as an argument
        if (!Array.isArray(modelConfig[name])) {
          var argsList = [];
          for (var i in modelConfig[name]) {
            argsList.push(_extends(_defineProperty({}, generator.key, i), modelConfig[name][i]));
          }
          modelConfig[name] = argsList;
        }

        modelConfig[name] = modelConfig[name].map(function (args) {
          return _this2._executeFunctions(args);
        });
        modelConfig[name].forEach(function (args) {
          return _this2._validateItem(args, generator);
        });

        return modelConfig[name].map(function (args) {
          return {
            type: generator.name,
            arguments: generator.arguments.build(args)
          };
        });
      }

      modelConfig[name] = this._executeFunctions(modelConfig[name]);
      this._validateItem(modelConfig[name], generator);

      return [{
        type: name,
        arguments: generator.arguments.build(modelConfig[name])
      }];
    }
  }, {
    key: '_executeFunctions',
    value: function _executeFunctions(item) {
      var _this3 = this;

      if (typeof item === 'string' && item.match(/^\s*(\.\w+)+(\(.*\))?\s*$/)) {
        return eval("(this.avifors.constructors" + item + ")");
      }

      if (Array.isArray(item)) {
        return item.map(function (i) {
          return _this3._executeFunctions(i);
        });
      }

      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && item !== null) {
        var res = {};
        for (var i in item) {
          res[i] = this._executeFunctions(item[i]);
        }
        return res;
      }

      return item;
    }
  }, {
    key: '_validateItem',
    value: function _validateItem(args, generator) {
      try {
        generator.arguments.validate(args, '');
      } catch (e) {
        throw _chalk2.default.bold.red('Error during model item validation:') + ' ' + e + '\n\n' + 'Item generating this error:\n\n' + this.yamlHelper.print(args);
      }
    }
  }]);

  return YamlModelBuilder;
}();

exports.default = YamlModelBuilder;