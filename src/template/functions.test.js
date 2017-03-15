import assert from 'assert'
import {functions} from './functions'

describe('# template/functions', function() {
    describe('_', function() {
        it("should display the joiner when the condition is true", () => assert.equal('\n', functions._(true)))
        it("should display nothing when the condition is false", () => assert.equal('', functions._(false)))
    })
})
