'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Configuration = function () {
  function Configuration() {
    var filePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './.avifors.yml';
    var yamlHelper = arguments[1];

    _classCallCheck(this, Configuration);

    var config = yamlHelper.readYamlFile(filePath);

    this._checkConfig(config);

    this.plugins = config.plugins;
    this.modelFiles = config.model;
  }

  _createClass(Configuration, [{
    key: '_checkConfig',
    value: function _checkConfig(config) {
      if (!_checkTypes2.default.nonEmptyObject(config)) throw 'The Avifors configuration file must contain fields ' + _chalk2.default.underline('plugins') + ' and ' + _chalk2.default.underline('model') + '.';
      if (!_checkTypes2.default.nonEmptyArray(config.plugins)) throw 'config.plugins must be a list containing the Avifors plugin files paths.';
      if (!_checkTypes2.default.nonEmptyArray(config.model)) throw 'config.model must be a list containing the model definition files paths.';
    }
  }]);

  return Configuration;
}();

exports.default = Configuration;