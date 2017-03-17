import assert from 'assert'
import Avifors from '../Avifors'

function exampleGenerator() {
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

  return generator
}

describe('# Avifors', function() {
  describe('type', function() {
    it("should be able to be normalized", () => {
      const avifors = new Avifors()
      avifors.setGenerator('test', exampleGenerator())
      assert.deepEqual(
        {
          name: 'string',
          properties: [{
            name: 'string',
            type: 'string',
            description: 'string'
          }]
        },
        avifors.getGenerator('test')[0].arguments.normalize()
      )
    })
  })
})
