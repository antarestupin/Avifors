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
})
