#! /usr/bin/env node
'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _Avifors = require('./Avifors');

var _Avifors2 = _interopRequireDefault(_Avifors);

var _YamlModelBuilder = require('./YamlModelBuilder');

var _YamlModelBuilder2 = _interopRequireDefault(_YamlModelBuilder);

var _Configuration = require('./Configuration');

var _Configuration2 = _interopRequireDefault(_Configuration);

var _help = require('./help');

var _YamlHelper = require('./tools/YamlHelper');

var _YamlHelper2 = _interopRequireDefault(_YamlHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var avifors = new _Avifors2.default();
var corePlugins = ['./template/plugin', './commands/plugin'];
corePlugins.forEach(function (plugin) {
  return require(plugin).default(avifors);
});

var argv = (0, _minimist2.default)(process.argv.slice(2));
var userCommand = argv._[0];
if (userCommand === undefined || userCommand === 'help') {
  console.log(_help.helpMessage);
} else {
  try {
    var yamlHelper = new _YamlHelper2.default();
    var config = new _Configuration2.default(argv.config, yamlHelper);

    avifors.loadPlugins(config.plugins);
    // console.log(avifors.generators)

    var modelBuilder = new _YamlModelBuilder2.default(avifors, yamlHelper);
    var model = modelBuilder.build(config.modelFiles);
    // console.log(model)

    avifors.getCommand(userCommand)({
      avifors: avifors,
      model: model,
      argv: argv
    });
  } catch (e) {
    console.log(e.message ? e.message : e);
  }
}