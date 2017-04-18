'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _Avifors = require('../Avifors');

var _Avifors2 = _interopRequireDefault(_Avifors);

var _helpers = require('./helpers.test');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('# Avifors', function () {
  describe('type', function () {
    it("should be able to be normalized", function () {
      var avifors = (0, _helpers.getAvifors)();

      _assert2.default.deepEqual({
        name: 'string (required)',
        properties: [{
          name: 'string (required)',
          type: 'string (enum[string, number, boolean], required)',
          description: 'string'
        }],
        resource: {
          'one of': ['string (required)', {
            'url': 'string (required)',
            'acl-role': 'string (required)'
          }]
        }
      }, avifors.getGenerator('entity')[0].arguments.normalize());
    });
  });
});