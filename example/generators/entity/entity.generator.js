module.exports.default = function(avifors) {
  avifors.setGenerator('entity', {
    list: "entities",
    key: "name",

    arguments: {
      name: avifors.types.string(),
      properties: avifors.types.list(
        avifors.types.map(
          {
            "name": avifors.types.string(),
            "type": avifors.types.string({validators: [avifors.validators.enum(['string', 'number', 'boolean'])]}),
            "description": avifors.types.optional.string()
          },
          () => ({
            "description": "@inheritdoc"
          })
        )
      )
    },

    outputs: [
      {
        path: "example/output/Entity/{{ name | pascalcase }}.php",
        template: "example/generators/entity/entity.template.php"
      }
    ]
  })

  // Lists the entities having a 'name' property
  // Can be used with: avifors query entity:with-name
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
  // Can be used with: avifors query entity:with-prop <propName>
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
