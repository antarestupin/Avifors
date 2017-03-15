'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filters = undefined;

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 'camelCase' => ['camel', 'case']
function splitVariableName(varName) {
  return ['-', '_'].map(function (i) {
    return varName.split(i);
  }).find(function (i) {
    return i.length > 1;
  }) // kebab-case / snake_case
  || varName.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase().split('-'); // PascalCase / camelCase
}

function scalableOrArrayFunction(fn) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (Array.isArray(args[0])) {
      var head = args.shift();
      return head.map(function (i) {
        return fn.apply(undefined, [i].concat(args));
      });
    }

    return fn.apply(undefined, args);
  };
}

// code conventions
var snakeCase = scalableOrArrayFunction(function (str) {
  return splitVariableName(str).join('_');
}); // snake_case
var kebabCase = scalableOrArrayFunction(function (str) {
  return splitVariableName(str).join('-');
}); // kebab-case
var camelCase = scalableOrArrayFunction(function (str) {
  return flower(pascalCase(str));
}); // camelCase
var pascalCase = scalableOrArrayFunction(function (str) {
  return splitVariableName(str).map(function (i) {
    return fupper(i);
  }).join('');
}); // PascalCase
var upperCamelCase = function upperCamelCase(str) {
  return pascalCase(str);
};
var lowerCamelCase = function lowerCamelCase(str) {
  return camelCase(str);
};

// string manipulation
var flower = scalableOrArrayFunction(function (str) {
  return str.charAt(0).toLowerCase() + str.substr(1);
}); // LOWER => lOWER
var fupper = scalableOrArrayFunction(function (str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}); // upper => Upper
var prepend = scalableOrArrayFunction(function (str, toPrepend) {
  return toPrepend + str;
}); // prepend('foo', '$') => $foo
var append = scalableOrArrayFunction(function (str, toAppend) {
  return str + toAppend;
}); // append('foo', '$') => foo$
var surround = scalableOrArrayFunction(function (str, toAdd) {
  return toAdd + str + toAdd;
}); // surround('foo', '$') => $foo$

// collection manipulation
var keys = function keys(dict) {
  return Object.keys(dict);
}; // get object keys
var values = function values(dict) {
  return Object.values(dict);
}; // get object values
var findByColumn = function findByColumn(list, column, value) {
  return list.filter(function (i) {
    return i[column] === value;
  });
}; // filter an object by the value of one of its columns
var findOneByColumn = function findOneByColumn(list, column, value) {
  return findByColumn(list, column, value)[0];
};
var map = function map(collection, fn) {
  return collection.map(eval(fn));
}; // apply a map to the collection with a JS function
var filter = function filter(collection, fn) {
  return collection.filter(eval(fn));
}; // apply a filter to the collection with a JS function

// data format
var jsonParse = function jsonParse(str) {
  return JSON.parse(str);
};
var jsonDump = function jsonDump(dict) {
  return JSON.stringify(dict);
};
var yamlParse = function yamlParse(str) {
  return _jsYaml2.default.safeLoad(str);
};
var yamlDump = function yamlDump(dict) {
  return _jsYaml2.default.safeDump(dict, { indent: 4 });
};

// other
var apply = function apply(val, fn) {
  return eval(fn)(val);
}; // apply a JS function to the given value

var filters = exports.filters = {
  snakecase: snakeCase,
  kebabcase: kebabCase,
  pascalcase: pascalCase,
  camelcase: camelCase,
  uppercamelcase: upperCamelCase,
  lowercamelcase: lowerCamelCase,

  flower: flower,
  fupper: fupper,
  prepend: prepend,
  append: append,
  surround: surround,

  keys: keys,
  values: values,
  findbycolumn: findByColumn,
  findonebycolumn: findOneByColumn,
  map: map,
  filter: filter,

  json: jsonDump,
  jsonparse: jsonParse,
  yaml: yamlDump,
  yamlparse: yamlParse,

  apply: apply
};