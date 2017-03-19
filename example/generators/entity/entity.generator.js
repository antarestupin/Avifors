module.exports.default = function(avifors) {
  avifors.setGenerator('entity', {
    list: "entities",
    key: "name",

    arguments: {
      name: avifors.types.string(),
      properties: avifors.types.list(
        avifors.types.map({
          "name": avifors.types.string(),
          "type": avifors.types.string(),
          "description": avifors.types.optional.string()
        })
      )
    },

    outputs: [
      {
        path: "example/output/Entity/{{ name | pascalcase }}.php",
        template: "example/generators/entity/entity.template.php"
      }
    ]
  })
}
