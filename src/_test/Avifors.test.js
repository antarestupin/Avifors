import assert from 'assert'
import Avifors from '../Avifors'
import {getAvifors} from './helpers.test'

describe('# Avifors', function() {
  describe('type', function() {
    it("should be able to be normalized", () => {
      const avifors = getAvifors()

      assert.deepEqual(
        {
          name: 'string (required)',
          properties: [{
            name: 'string (required)',
            type: 'string (enum[string, number, boolean], required)',
            description: 'string'
          }]
        },
        avifors.getGenerator('entity')[0].arguments.normalize()
      )
    })
  })
})
