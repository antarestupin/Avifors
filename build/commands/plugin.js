'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (avifors) {
  var commands = {
    generate: function generate(_ref) {
      var avifors = _ref.avifors,
          model = _ref.model;

      var generator = new _Generator2.default(avifors, new _YamlHelper2.default());
      generator.generate(model);
    },

    interface: function _interface(_ref2) {
      var avifors = _ref2.avifors,
          argv = _ref2.argv;

      var interfacePrinter = new _InterfacePrinter2.default(avifors, new _YamlHelper2.default());
      if (argv._[1] !== undefined) {
        console.log(interfacePrinter.printItem(argv._[1]));
      } else {
        console.log(interfacePrinter.print());
      }
    },

    query: function query(_ref3) {
      var avifors = _ref3.avifors,
          model = _ref3.model,
          argv = _ref3.argv;

      var query = new _Query2.default(avifors, model);
      query.executeQuery(argv);
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

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

var _YamlHelper = require('../tools/YamlHelper');

var _YamlHelper2 = _interopRequireDefault(_YamlHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }