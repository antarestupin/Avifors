'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _YamlHelper = require('../YamlHelper');

var _YamlHelper2 = _interopRequireDefault(_YamlHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('# tools/YamlHelper', function () {
  describe('serialize', function () {
    it("should serialize given structure", function () {
      return _assert2.default.equal("config:\n  a: b\n  c: d\n", new _YamlHelper2.default().serialize({ config: { a: "b", c: "d" } }));
    });
  });
});