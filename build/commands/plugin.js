'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (avifors) {
  var commands = {
    generate: function generate(_ref) {
      var avifors = _ref.avifors,
          model = _ref.model;

      var generator = new _Generator2.default(avifors);
      generator.generate(model);
    },
    interface: function _interface(_ref2) {
      var avifors = _ref2.avifors,
          argv = _ref2.argv;

      var interfacePrinter = new _InterfacePrinter2.default(avifors);
      if (argv._[1] !== undefined) {
        console.log(interfacePrinter.printItem(argv._[1]));
      } else {
        console.log(interfacePrinter.print());
      }
    }
  };

  for (var i in commands) {
    avifors.setCommand(i, commands[i]);
  }
};

var _Generator = require('./Generator');

var _Generator2 = _interopRequireDefault(_Generator);

var _InterfacePrinter = require('./InterfacePrinter');

var _InterfacePrinter2 = _interopRequireDefault(_InterfacePrinter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }