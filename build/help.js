'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helpMessage = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpMessage = exports.helpMessage = '\nAvifors is a tool to generate code from templates and separate your app model from its implementation.\n\n' + _chalk2.default.bold.underline('Usage') + ': ' + _chalk2.default.cyan('avifors [--config="./path/to/config"] [command]') + '\n\n' + _chalk2.default.bold.underline('Commands') + ':\n\n  ' + _chalk2.default.bgWhite.black('generate             ') + ' Generates the implementation (code) files from your model.\n  ' + _chalk2.default.bgWhite.black('interface [generator]') + ' Shows the interface of your generators; or the interface of given generator if given.\n\n' + _chalk2.default.bold.underline('Arguments') + ':\n\n  ' + _chalk2.default.bgWhite.black('--config') + ' Sets the path to Avifors\' configuration file (defaults to ' + _chalk2.default.cyan('./.avifors.yml') + ')\n\nMore information is available at ' + _chalk2.default.underline('https://github.com/antarestupin/Avifors') + '\n';