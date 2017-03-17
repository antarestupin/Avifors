'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _functions = require('./functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('# template/functions', function () {
  describe('_', function () {
    it("should display the joiner when the condition is true", function () {
      return _assert2.default.equal('\n', _functions.functions._(true));
    });
    it("should display nothing when the condition is false", function () {
      return _assert2.default.equal('', _functions.functions._(false));
    });
  });
});