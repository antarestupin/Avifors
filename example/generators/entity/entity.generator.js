module.exports.default = function(avifors) {
  avifors.setGenerator('entity', {
    list: "entities",
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
  })
}
