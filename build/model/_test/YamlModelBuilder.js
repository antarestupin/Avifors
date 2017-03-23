'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _helpers = require('../../_test/helpers.test');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('# model/YamlModelBuilder', function () {
  describe('_validateItem', function () {
    it("should do nothing if given item is correct", function () {
      var model = (0, _helpers.getModel)();
    });

    it("should throw an error if an item is incorrect", function () {
      return _assert2.default.throws(function () {
        var modelBuilder = (0, _helpers.getModelBuilder)();
        var model = (0, _helpers.getModel)();
        model[0].arguments.name = true;
        modelBuilder._validateItem(model[0], modelBuilder.avifors.getGenerator(model[0].type)[0]);
      });
    });
  });
});