import assert from 'assert'
import {getModelBuilder, getModel} from '../../_test/helpers.test'

describe('# model/YamlModelBuilder', function() {
  describe('_validateItem', function() {
    it("should do nothing if given item is correct", () => {
      const model = getModel()
    })

    it("should throw an error if an item is incorrect", () => assert.throws(() => {
      const modelBuilder = getModelBuilder()
      const model = getModel()
      model[0].arguments.name = true
      modelBuilder._validateItem(model[0], modelBuilder.avifors.getGenerator(model[0].type)[0])
    }))
  })
})
