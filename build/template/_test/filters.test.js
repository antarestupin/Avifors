'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _filters = require('../filters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('# template/filters', function () {

    // Code conventions

    describe('snakecase', function () {
        it("should snake_case given string", function () {
            return _assert2.default.equal('hello_world', _filters.filters.snakecase('HelloWorld'));
        });
        it("should snake_case each string in a list", function () {
            return _assert2.default.deepEqual(['hello_world', 'test_test'], _filters.filters.snakecase(['HelloWorld', 'TestTest']));
        });
    });

    describe('kebabcase', function () {
        it("should kebab-case given string", function () {
            return _assert2.default.equal('hello-world', _filters.filters.kebabcase('HelloWorld'));
        });
        it("should kebab-case each string in a list", function () {
            return _assert2.default.deepEqual(['hello-world', 'test-test'], _filters.filters.kebabcase(['HelloWorld', 'TestTest']));
        });
    });

    describe('pascalcase', function () {
        it("should PascalCase given string", function () {
            return _assert2.default.equal('HelloWorld', _filters.filters.pascalcase('hello_world'));
        });
        it("should PascalCase each string in a list", function () {
            return _assert2.default.deepEqual(['HelloWorld', 'TestTest'], _filters.filters.pascalcase(['hello_world', 'test_test']));
        });
    });

    describe('camelcase', function () {
        it("should camelCase given string", function () {
            return _assert2.default.equal('helloWorld', _filters.filters.camelcase('hello_world'));
        });
        it("should camelCase each string in a list", function () {
            return _assert2.default.deepEqual(['helloWorld', 'testTest'], _filters.filters.camelcase(['hello_world', 'test_test']));
        });
    });

    describe('uppercamelcase', function () {
        it("should PascalCase given string", function () {
            return _assert2.default.equal('HelloWorld', _filters.filters.uppercamelcase('hello_world'));
        });
        it("should PascalCase each string in a list", function () {
            return _assert2.default.deepEqual(['HelloWorld', 'TestTest'], _filters.filters.uppercamelcase(['hello_world', 'test_test']));
        });
    });

    describe('lowercamelcase', function () {
        it("should camelCase given string", function () {
            return _assert2.default.equal('helloWorld', _filters.filters.lowercamelcase('hello_world'));
        });
        it("should camelCase each string in a list", function () {
            return _assert2.default.deepEqual(['helloWorld', 'testTest'], _filters.filters.lowercamelcase(['hello_world', 'test_test']));
        });
    });

    // String manipulation

    describe('flower', function () {
        it("should lowercase the first letter of given string", function () {
            return _assert2.default.equal('tEST', _filters.filters.flower('TEST'));
        });
        it("should lowercase the first letter of each string in a list", function () {
            return _assert2.default.deepEqual(['tEST', 'hELLO'], _filters.filters.flower(['TEST', 'HELLO']));
        });
    });

    describe('fupper', function () {
        it("should uppercase the first letter of given string", function () {
            return _assert2.default.equal('Test', _filters.filters.fupper('test'));
        });
        it("should uppercase the first letter of each string in a list", function () {
            return _assert2.default.deepEqual(['Test', 'Hello'], _filters.filters.fupper(['test', 'hello']));
        });
    });

    describe('prepend', function () {
        it("should prepend a string to another string", function () {
            return _assert2.default.equal('$test', _filters.filters.prepend('test', '$'));
        });
        it("should prepend a string to each string in a list", function () {
            return _assert2.default.deepEqual(['$test', '$hello'], _filters.filters.prepend(['test', 'hello'], '$'));
        });
    });

    describe('append', function () {
        it("should append a string to another string", function () {
            return _assert2.default.equal('test$', _filters.filters.append('test', '$'));
        });
        it("should append a string to each string in a list", function () {
            return _assert2.default.deepEqual(['test$', 'hello$'], _filters.filters.append(['test', 'hello'], '$'));
        });
    });

    describe('surround', function () {
        it("should surround a string by another string", function () {
            return _assert2.default.equal('$test$', _filters.filters.surround('test', '$'));
        });
        it("should surround each string in a list by a string", function () {
            return _assert2.default.deepEqual(['$test$', '$hello$'], _filters.filters.surround(['test', 'hello'], '$'));
        });
    });

    // Collection manipulation

    describe('keys', function () {
        it("should give an object's keys", function () {
            return _assert2.default.deepEqual(['foo'], _filters.filters.keys({ foo: 'bar' }));
        });
    });

    describe('values', function () {
        it("should give an object's values", function () {
            return _assert2.default.deepEqual(['bar'], _filters.filters.values({ foo: 'bar' }));
        });
    });

    describe('toArray', function () {
        it("should transform a dict to an array of dicts", function () {
            return _assert2.default.deepEqual([{ id: 'a', b: 'c' }], _filters.filters.toArray({ a: { b: 'c' } }, 'id'));
        });
    });

    describe('findbycolumn', function () {
        it("should filter an object by the value of one of its columns", function () {
            return _assert2.default.deepEqual([{ foo: 'bar' }], _filters.filters.findbycolumn([{ foo: 'bar' }, { test: 'ok' }], 'foo', 'bar'));
        });
    });

    describe('findonebycolumn', function () {
        it("should filter an object by the value of one of its columns", function () {
            return _assert2.default.deepEqual({ foo: 'bar' }, _filters.filters.findonebycolumn([{ foo: 'bar' }, { test: 'ok' }], 'foo', 'bar'));
        });
    });

    describe('map', function () {
        it("should map an array using given function", function () {
            return _assert2.default.deepEqual([2, 3], _filters.filters.map([1, 2], "i => i + 1"));
        });
    });

    describe('filter', function () {
        it("should filter an array using given function", function () {
            return _assert2.default.deepEqual([1], _filters.filters.filter([1, 2], "i => i === 1"));
        });
    });

    // Data format

    describe('json', function () {
        it("should dump given object into JSON", function () {
            return _assert2.default.deepEqual('["hello"]', _filters.filters.json(['hello']));
        });
    });

    describe('jsonparse', function () {
        it("should parse given JSON object", function () {
            return _assert2.default.deepEqual(['hello'], _filters.filters.jsonparse('["hello"]'));
        });
    });

    describe('yaml', function () {
        it("should dump given object into YAML", function () {
            return _assert2.default.deepEqual('- hello\n', _filters.filters.yaml(['hello']));
        });
    });

    describe('yamlparse', function () {
        it("should parse given YAML object", function () {
            return _assert2.default.deepEqual(['hello'], _filters.filters.yamlparse('- hello\n'));
        });
    });

    // Other

    describe('apply', function () {
        it("should apply a function to a value", function () {
            return _assert2.default.deepEqual(2, _filters.filters.apply(1, "i => i + 1"));
        });
    });
});