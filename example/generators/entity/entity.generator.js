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
          "description": avifors.types.optional.string()
        }, { builders: [avifors.builders.mapDefaultValues(() => ({ description: "@inheritdoc" }))] })
      )
    },

    outputs: [
      {
        path: "example/output/Entity/{{ name | pascalcase }}.php",
        template: "example/generators/entity/entity.template.php"
      }
    ]
  })

  // Example of a command you can create for your own purposes
  // Lists the entities having a 'name' property
  avifors.setCommand(
    'entitiesHavingName',
    ({avifors, model}) => avifors.helpers.printYaml(
      model
        .filter(i => i.type === 'entity' && i.arguments.properties.some(j => j.name === 'name'))
        .map(i => i.arguments.name)
    )
  )
}
