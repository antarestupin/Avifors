const assert = require('assert')
const filters = require('../../src/template/filters')

describe('# template/filters', function() {

    // Code conventions

    describe('snakecase', function() {
        it("should snake_case given string",          () => assert.equal('hello_world', filters.snakecase('HelloWorld')))
        it("should snake_case each string in a list", () => assert.deepEqual(['hello_world', 'test_test'], filters.snakecase(['HelloWorld', 'TestTest'])))
    })

    describe('kebabcase', function() {
        it("should kebab-case given string",          () => assert.equal('hello-world', filters.kebabcase('HelloWorld')))
        it("should kebab-case each string in a list", () => assert.deepEqual(['hello-world', 'test-test'], filters.kebabcase(['HelloWorld', 'TestTest'])))
    })

    describe('pascalcase', function() {
        it("should PascalCase given string",          () => assert.equal('HelloWorld', filters.pascalcase('hello_world')))
        it("should PascalCase each string in a list", () => assert.deepEqual(['HelloWorld', 'TestTest'], filters.pascalcase(['hello_world', 'test_test'])))
    })

    describe('camelcase', function() {
        it("should camelCase given string",          () => assert.equal('helloWorld', filters.camelcase('hello_world')))
        it("should camelCase each string in a list", () => assert.deepEqual(['helloWorld', 'testTest'], filters.camelcase(['hello_world', 'test_test'])))
    })

    describe('uppercamelcase', function() {
        it("should PascalCase given string",          () => assert.equal('HelloWorld', filters.uppercamelcase('hello_world')))
        it("should PascalCase each string in a list", () => assert.deepEqual(['HelloWorld', 'TestTest'], filters.uppercamelcase(['hello_world', 'test_test'])))
    })

    describe('lowercamelcase', function() {
        it("should camelCase given string",          () => assert.equal('helloWorld', filters.lowercamelcase('hello_world')))
        it("should camelCase each string in a list", () => assert.deepEqual(['helloWorld', 'testTest'], filters.lowercamelcase(['hello_world', 'test_test'])))
    })

    // String manipulation

    describe('flower', function() {
        it("should lowercase the first letter of given string",          () => assert.equal('tEST', filters.flower('TEST')))
        it("should lowercase the first letter of each string in a list", () => assert.deepEqual(['tEST', 'hELLO'], filters.flower(['TEST', 'HELLO'])))
    })

    describe('fupper', function() {
        it("should uppercase the first letter of given string",          () => assert.equal('Test', filters.fupper('test')))
        it("should uppercase the first letter of each string in a list", () => assert.deepEqual(['Test', 'Hello'], filters.fupper(['test', 'hello'])))
    })

    describe('prepend', function() {
        it("should prepend a string to another string",        () => assert.equal('$test', filters.prepend('test', '$')))
        it("should prepend a string to each string in a list", () => assert.deepEqual(['$test', '$hello'], filters.prepend(['test', 'hello'], '$')))
    })

    describe('append', function() {
        it("should append a string to another string",        () => assert.equal('test$', filters.append('test', '$')))
        it("should append a string to each string in a list", () => assert.deepEqual(['test$', 'hello$'], filters.append(['test', 'hello'], '$')))
    })

    describe('surround', function() {
        it("should surround a string by another string",        () => assert.equal('$test$', filters.surround('test', '$')))
        it("should surround each string in a list by a string", () => assert.deepEqual(['$test$', '$hello$'], filters.surround(['test', 'hello'], '$')))
    })

    // Collection manipulation

    describe('keys', function() {
        it("should give an object's keys", () => assert.deepEqual(['foo'], filters.keys({ foo: 'bar' })))
    })

    describe('values', function() {
        it("should give an object's values", () => assert.deepEqual(['bar'], filters.values({ foo: 'bar' })))
    })

    describe('findbycolumn', function() {
        it("should filter an object by the value of one of its columns", () => assert.deepEqual([{ foo: 'bar' }], filters.findbycolumn([{ foo: 'bar' }, { test: 'ok' }], 'foo', 'bar')))
    })

    describe('findonebycolumn', function() {
        it("should filter an object by the value of one of its columns", () => assert.deepEqual({ foo: 'bar' }, filters.findonebycolumn([{ foo: 'bar' }, { test: 'ok' }], 'foo', 'bar')))
    })

    describe('map', function() {
        it("should map an array using given function", () => assert.deepEqual([2, 3], filters.map([1, 2], "i => i + 1")))
    })

    describe('filter', function() {
        it("should filter an array using given function", () => assert.deepEqual([1], filters.filter([1, 2], "i => i === 1")))
    })

    // Data format

    describe('json', function() {
        it("should dump given object into JSON", () => assert.deepEqual('["hello"]', filters.json(['hello'])))
    })

    describe('jsonparse', function() {
        it("should parse given JSON object", () => assert.deepEqual(['hello'], filters.jsonparse('["hello"]')))
    })

    describe('yaml', function() {
        it("should dump given object into YAML", () => assert.deepEqual('- hello\n', filters.yaml(['hello'])))
    })

    describe('yamlparse', function() {
        it("should parse given YAML object", () => assert.deepEqual(['hello'], filters.yamlparse('- hello\n')))
    })

    // Other

    describe('apply', function() {
        it("should apply a function to a value", () => assert.deepEqual(2, filters.apply(1, "i => i + 1")))
    })

})
