'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfiguration = getConfiguration;
exports.getAvifors = getAvifors;
exports.getModelBuilder = getModelBuilder;
exports.getModel = getModel;
exports.getGenerator = getGenerator;
exports.getInterfacePrinter = getInterfacePrinter;

var _Avifors = require('../Avifors');

var _Avifors2 = _interopRequireDefault(_Avifors);

var _Configuration = require('../Configuration');

var _Configuration2 = _interopRequireDefault(_Configuration);

var _YamlModelBuilder = require('../YamlModelBuilder');

var _YamlModelBuilder2 = _interopRequireDefault(_YamlModelBuilder);

var _YamlHelper = require('../tools/YamlHelper');

var _YamlHelper2 = _interopRequireDefault(_YamlHelper);

var _Generator = require('../commands/Generator');

var _Generator2 = _interopRequireDefault(_Generator);

var _InterfacePrinter = require('../commands/InterfacePrinter');

var _InterfacePrinter2 = _interopRequireDefault(_InterfacePrinter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfiguration() {
  return new _Configuration2.default('./example/.avifors.yml', new _YamlHelper2.default());
}

function getAvifors() {
  var avifors = new _Avifors2.default();

  var corePlugins = ['../model/plugin', '../template/plugin', '../commands/plugin'];
  corePlugins.forEach(function (plugin) {
    return require(plugin).default(avifors);
  });

  avifors.loadPlugins(getConfiguration().plugins);
  return avifors;
}

function getModelBuilder() {
  return new _YamlModelBuilder2.default(getAvifors(), new _YamlHelper2.default());
}

function getModel() {
  return getModelBuilder().build(getConfiguration().modelFiles);
}

function getGenerator() {
  return new _Generator2.default(getAvifors(), new _YamlHelper2.default());
}

function getInterfacePrinter() {
  return new _InterfacePrinter2.default(getAvifors(), new _YamlHelper2.default());
}