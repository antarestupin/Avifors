'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Configuration = function () {
  function Configuration() {
    var filePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './.avifors.yaml';

    _classCallCheck(this, Configuration);

    var config = this._readYamlFile(filePath);
    this.plugins = config.plugins;
    this.modelFiles = config.model;
  }

  // Reads and parse given YAML file


  _createClass(Configuration, [{
    key: '_readYamlFile',
    value: function _readYamlFile(path) {
      try {
        return _jsYaml2.default.safeLoad(_fs2.default.readFileSync(path, 'utf8'));
      } catch (e) {
        if (e instanceof _jsYaml2.default.YAMLException) throw 'Could not parse file ' + path + '.\nCause:\n\n' + e.message;else throw 'Could not read file ' + path + '.';
      }
    }
  }]);

  return Configuration;
}();

exports.default = Configuration;