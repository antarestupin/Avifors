module.exports.default = function(avifors) {
  avifors.setGenerator('entity', {
    list: "entities",
    key: "name",

    arguments: {
      name: avifors.types.string(),
      properties: avifors.types.list(
        avifors.types.map({
          "name": avifors.types.string(),
          "type": avifors.types.string({validators: [avifors.validators.enum(['string', 'number', 'boolean'])]}),
          "description": avifors.types.optional.string(),
          "constraints": avifors.types.list(
            avifors.types.map({
              "type": avifors.types.string()
            }, { strict: false })
          )
        }, {
          defaults: () => ({
            "description": "@inheritdoc",
            "constraints": []
          })
        })
      ),
      resource: avifors.types.oneOf([
        avifors.types.string(),
        avifors.types.map({
          "url": avifors.types.string(),
          "acl-role": avifors.types.string()
        }, {
          defaults: () => ({
            "acl-role": "none"
          })
        })
      ], (value, typeIndex) => typeIndex ? value: { url: value })
    },

    outputs: [
      {
        path: "test/output/Entity/{{ name | pascalcase }}.php",
        template: "test/generators/entity/entity.template.php"
      }
    ]
  })

  avifors.constructors.constraints = {
    between: (min, max) => ({
      type: 'between',
      min: min,
      max: max
    })
  }

  // Lists the entities having a 'name' property
  // Tests a query without arguments
  avifors.setQuery(
    'entity:with-name',
    {
      description: 'List the entities having a name property',
      resolve: ({model}) => model
          .filter(i => i.type === 'entity' && i.arguments.properties.some(j => j.name === 'name'))
          .map(i => i.arguments.name)
    }
  )

  // Lists the entities having given property
  // Tests a query using arguments
  avifors.setQuery(
    'entity:with-prop',
    {
      description: 'List the entities having given property',
      arguments: ['propName'],
      resolve: ({model}, {propName}) => model
          .filter(i => i.type === 'entity' && i.arguments.properties.some(j => j.name === propName))
          .map(i => i.arguments.name)
    }
  )
}
