import assert from 'assert'
import {getGenerator, getModel} from '../../_test/helpers.test'

describe('# commands/Generator', function() {
  describe('_validateItem', function() {
    it("should do nothing if given item is correct", () => {
      const generator = getGenerator()
      const model = getModel()
      model.forEach(item => {
        generator._validateItem(item, generator.avifors.getGenerator(item.type)[0])
      })
    })

    it("should throw an error if an item is incorrect", () => assert.throws(() => {
      const generator = getGenerator()
      const model = getModel()
      model[0].arguments.name = true
      generator._validateItem(model[0], generator.avifors.getGenerator(model[0].type)[0])
    }))
  })
})
