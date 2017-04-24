import assert from 'assert'
import Avifors from '../Avifors'
import {getAvifors} from './helpers.test'

describe('# Avifors', function() {
  describe('type', function() {
    it("should be able to be normalized", () => {
      const avifors = getAvifors()

      assert.deepEqual(
        {
          name: 'string',
          properties: [{
            name: 'string',
            type: 'string (enum[string, number, boolean])',
            description: 'string',
            constraints: [{
              type: 'string'
            }]
          }],
          resource: {
            'one of': [
              'string',
              {
                'url': 'string',
                'acl-role': 'string'
              }
            ]
          }
        },
        avifors.getGenerator('entity')[0].arguments.normalize()
      )
    })
  })
})
