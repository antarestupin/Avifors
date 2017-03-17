'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Configuration = function Configuration() {
  var filePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './.avifors.yaml';
  var yamlHelper = arguments[1];

  _classCallCheck(this, Configuration);

  var config = yamlHelper.readYamlFile(filePath);
  this.plugins = config.plugins;
  this.modelFiles = config.model;
};

exports.default = Configuration;