'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YamlHelper = function () {
  function YamlHelper() {
    _classCallCheck(this, YamlHelper);
  }

  _createClass(YamlHelper, [{
    key: 'readYamlFile',

    // Reads and parse given YAML file
    value: function readYamlFile(path) {
      try {
        return _jsYaml2.default.safeLoad(_fs2.default.readFileSync(path, 'utf8'));
      } catch (e) {
        if (e instanceof _jsYaml2.default.YAMLException) throw 'Could not parse file ' + path + '.\nCause:\n\n' + e.message;else throw 'Could not read file ' + path + '.';
      }
    }
  }, {
    key: 'serialize',
    value: function serialize(toSerialize) {
      return _jsYaml2.default.safeDump(toSerialize, { indent: 2, lineWidth: 120, skipInvalid: true });
    }
  }, {
    key: 'print',
    value: function print(toPrint) {
      return this.serialize(toPrint).replace(/([\w\s\-]+):/g, _chalk2.default.cyan('$1') + ':');
    }
  }]);

  return YamlHelper;
}();

exports.default = YamlHelper;