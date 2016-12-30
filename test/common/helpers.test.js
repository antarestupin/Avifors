const assert = require('assert')
const helpers = require('../../src/common/helpers')

describe('# common/helpers', function() {
    describe('getType', function() {
        it("should return the type of given value", () => {
            assert.equal('scalar', helpers.getType(1))
            assert.equal('scalar', helpers.getType('a'))
            assert.equal('scalar', helpers.getType(true))
            assert.equal('list', helpers.getType([]))
            assert.equal('map', helpers.getType({}))
            assert.equal('null', helpers.getType(null))
            assert.equal('null', helpers.getType(undefined))
        })
    })

    describe('findListItemName', function() {
        it("should find the name of the list item name for given item", () => assert.equal('users', helpers.findListItemName('user', {
            'user': {},
            'users': {
                list: true,
                origin: 'user'
            }
        })))
        it("should return null if no list item is found", () => assert.equal(null, helpers.findListItemName('user', { 'user': {} })))
    })

    describe('fileExists', function() {
        it("should return true if the file exists", () => assert.equal(
            true,
            helpers.fileExists('hello.txt', { fs: { readFileSync: () => 'file contents' } })
        ))

        it("should return false if the file does not exist", () => assert.equal(
            false,
            helpers.fileExists('hello.txt', { fs: { readFileSync: () => { throw 'file not found' } } })
        ))
    })

    describe('isScalar', function() {
        it('should indicate if given value is a scalar', () => {
            assert.equal(true, helpers.isScalar(42))
            assert.equal(true, helpers.isScalar('test'))
            assert.equal(true, helpers.isScalar(true))
            assert.equal(false, helpers.isScalar([]))
            assert.equal(false, helpers.isScalar({}))
        })
    })

    describe('getUserDefinedProperties', function() {
        it('should return an object with only user-defined properties', () => assert.deepEqual(
            {
                'a': 'aVal',
                'b': 'bVal'
            },
            helpers.getUserDefinedProperties({
                'a': 'aVal',
                '_type': 'test',
                'b': 'bVal'
            })
        ))
    })

    describe('getArgType', function() {
        it('should return the type of a model argument', () => {
            assert.equal('string', helpers.getArgType('string'))
            assert.equal('list', helpers.getArgType(['string']))
            assert.equal('map', helpers.getArgType({'a': 'string'}))
        })
        it('should use the _contents prop if available', () => assert.equal('string', helpers.getArgType({ _contents: 'string' })))
    })

    describe('readYaml', function() {
        it("should read and parse a YAML file", () => assert.deepEqual(
            ['foo', 'bar'],
            helpers.readYaml('test.yaml', { fs: { readFileSync: () => '- foo\n- bar' } })
        ))
    })

    describe('writeFile', function() {
        // TODO
    })
})
