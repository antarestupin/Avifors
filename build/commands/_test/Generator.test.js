'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _helpers = require('../../_test/helpers.test');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('# commands/Generator', function () {
  describe('_validateItem', function () {
    it("should do nothing if given item is correct", function () {
      var generator = (0, _helpers.getGenerator)();
      var model = (0, _helpers.getModel)();
      model.forEach(function (item) {
        generator._validateItem(item, generator.avifors.getGenerator(item.type)[0]);
      });
    });

    it("should throw an error if an item is incorrect", function () {
      return _assert2.default.throws(function () {
        var generator = (0, _helpers.getGenerator)();
        var model = (0, _helpers.getModel)();
        model[0].arguments.name = true;
        generator._validateItem(model[0], generator.avifors.getGenerator(model[0].type)[0]);
      });
    });
  });
});