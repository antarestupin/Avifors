const assert = require('assert')
const functions = require('../../src/template/functions')

describe('# template/functions', function() {
    describe('_', function() {
        it("should display the joiner when the condition is true", () => assert.equal('\n', functions._(true)))
        it("should display nothing when the condition is false", () => assert.equal('', functions._(false)))
    })

    describe('readFile', function() {
        it("should return the contents of the file at given path", () => assert.equal(
            'hello',
            functions.readFile('hello.txt', { fs: { readFileSync: () => 'hello' } })
        ))
    })
})
