'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helpMessage = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpMessage = exports.helpMessage = '\nAvifors is a MDE tool that generates code from a YAML definition of your app domain model.\n\n' + _chalk2.default.bold.underline('Usage') + ': ' + _chalk2.default.cyan('avifors [--config="./path/to/config"] [command]') + '\n\n' + _chalk2.default.bold.underline('Commands') + ':\n\n  ' + _chalk2.default.bold.white('generate             ') + ' Generates the implementation (code) files from your model.\n  ' + _chalk2.default.bold.white('help                 ') + ' Displays this message.\n  ' + _chalk2.default.bold.white('interface [generator]') + ' Shows the interface of your generators; or the interface of given generator if given.\n  ' + _chalk2.default.bold.white('query     [queryName]') + ' Resolves given query to the model and prints the result.\n\n' + _chalk2.default.bold.underline('Arguments') + ':\n\n  ' + _chalk2.default.bold.white('--config') + ' Sets the path to Avifors\' configuration file (defaults to ' + _chalk2.default.cyan('./.avifors.yml') + ')\n\nMore information is available at ' + _chalk2.default.underline('https://github.com/antarestupin/Avifors') + '\n';