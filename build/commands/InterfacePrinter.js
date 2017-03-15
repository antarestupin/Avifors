'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InterfacePrinter = function () {
  function InterfacePrinter(avifors) {
    _classCallCheck(this, InterfacePrinter);

    this.avifors = avifors;
  }

  _createClass(InterfacePrinter, [{
    key: 'print',
    value: function print() {
      return this.serialize(this.avifors.generators.map(function (i) {
        return { name: i.name, arguments: i.arguments.normalize() };
      }));
    }
  }, {
    key: 'printItem',
    value: function printItem(name) {
      var item = this.avifors.generators.find(function (i) {
        return i.name === name;
      });
      return this.serialize(item.arguments.normalize());
    }
  }, {
    key: 'serialize',
    value: function serialize(toSerialize) {
      return _jsYaml2.default.safeDump(toSerialize, { indent: 2, lineWidth: 120 }).replace(/(\w+):/g, _chalk2.default.cyan('$1') + ':');
    }
  }]);

  return InterfacePrinter;
}();

exports.default = InterfacePrinter;