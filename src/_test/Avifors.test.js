import assert from 'assert'
import Avifors from '../Avifors'

describe('# Avifors', function() {
  describe('types', function() {
    const avifors = new Avifors()
    const generator = {
      list: "tests",
      key: "name",
      arguments: {
        name: avifors.type.string(),
        properties: avifors.type.list(
          avifors.type.map({
            "name": avifors.type.string(),
            "type": avifors.type.string(),
            "description": avifors.type.string()
          })
        )
      },
      outputs: [
        {
          path: "example/output/Entity/{{ name | pascalcase }}.php",
          template: "example/generators/entity/entity.template.php"
        }
      ]
    }

    it("should be able to be normalized", () => {
      const av = new Avifors()
      av.setGenerator('test', generator)
      assert.deepEqual(
        {
          name: 'string',
          properties: [{
            name: 'string',
            type: 'string',
            description: 'string'
          }]
        },
        av.getGenerator('test')[0].arguments.normalize()
      )
    })
  })
})
