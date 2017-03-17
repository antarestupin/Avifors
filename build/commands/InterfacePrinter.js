"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InterfacePrinter = function () {
  function InterfacePrinter(avifors, yamlHelper) {
    _classCallCheck(this, InterfacePrinter);

    this.avifors = avifors;
    this.yamlHelper = yamlHelper;
  }

  _createClass(InterfacePrinter, [{
    key: "print",
    value: function print() {
      return this.yamlHelper.print(this.avifors.generators.map(function (i) {
        return { name: i.name, arguments: i.arguments.normalize() };
      }));
    }
  }, {
    key: "printItem",
    value: function printItem(name) {
      var item = this.avifors.generators.find(function (i) {
        return i.name === name;
      });
      return this.yamlHelper.print(item.arguments.normalize());
    }
  }]);

  return InterfacePrinter;
}();

exports.default = InterfacePrinter;