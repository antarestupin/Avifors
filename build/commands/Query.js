'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Query = function () {
  function Query(avifors, model) {
    _classCallCheck(this, Query);

    this.avifors = avifors;
    this.model = model;
  }

  _createClass(Query, [{
    key: 'executeQuery',
    value: function executeQuery(argv) {
      var queryName = argv._[1];
      if (queryName === undefined) {
        this.printQueries();
        return;
      }

      var query = this.avifors.getQuery(queryName);
      var args = {};
      argv._.slice(2).forEach(function (arg, i) {
        return args[query.arguments[i]] = arg;
      });

      this.avifors.helpers.printYaml(query.resolve({
        model: this.model,
        argv: argv._.slice(2),
        avifors: this.avifors
      }, args));
    }
  }, {
    key: 'printQueries',
    value: function printQueries() {
      var _this = this;

      Object.keys(this.avifors.queries).map(function (query) {
        return _chalk2.default.cyan(query) + "\t" + _chalk2.default.gray((_this.avifors.queries[query].arguments || []).join(', ')) + "\t" + _this.avifors.queries[query].description;
      }).forEach(function (i) {
        return console.log(i);
      });
    }
  }]);

  return Query;
}();

exports.default = Query;