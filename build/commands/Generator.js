'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Generator = function () {
  function Generator(avifors, yamlHelper) {
    _classCallCheck(this, Generator);

    this.avifors = avifors;
    this.yamlHelper = yamlHelper;
  }

  _createClass(Generator, [{
    key: 'generate',
    value: function generate(model) {
      var _this = this;

      this.avifors.nunjucks.addGlobal('model', model);
      model.forEach(function (item) {
        var generator = _this.avifors.getGenerator(item.type)[0];
        _this._validateItem(item, generator);
        generator.outputs.map(function (i) {
          return i(item.arguments);
        }).map(function (i) {
          return _extends({
            contents: _this.avifors.nunjucks.render(i.template, item.arguments)
          }, i);
        }).forEach(function (i) {
          return _this._writeFile(i.path, i.contents);
        });
      });
    }
  }, {
    key: '_validateItem',
    value: function _validateItem(item, generator) {
      try {
        generator.arguments.validate(item.arguments, '');
      } catch (e) {
        throw _chalk2.default.bold.red('Error during model item validation:') + ' ' + e + '\n\n' + 'Item generating this error:\n\n' + this.yamlHelper.print(item.arguments);
      }
    }
  }, {
    key: '_writeFile',
    value: function _writeFile(filePath, contents) {
      try {
        var dirPath = _path2.default.dirname(filePath);
        try {
          _fs2.default.statSync(dirPath);
        } catch (e) {
          _mkdirp2.default.sync(dirPath);
        }

        _fs2.default.writeFileSync(filePath, contents, { flag: 'w+' });
      } catch (e) {
        throw 'Could not write file ' + filePath;
      }
    }
  }]);

  return Generator;
}();

exports.default = Generator;