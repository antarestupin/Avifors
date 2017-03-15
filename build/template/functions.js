'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functions = undefined;

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var functions = exports.functions = {
  _: function _(cond) {
    var joiner = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\n';
    return cond ? joiner : '';
  },
  readFile: function readFile(path) {
    return _fs2.default.readFileSync(path, 'utf8');
  }
};