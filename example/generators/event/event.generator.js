module.exports.default = function(avifors) {
  avifors.setGenerator('event', {
    list: "events",
    key: "name",

    arguments: {
      name: avifors.types.string(),
      attributes: avifors.types.list(
        avifors.types.string()
      )
    },

    outputs: [
      {
        path: "example/output/Event/{{ name | pascalcase }}.php",
        template: "example/generators/event/event.template.php"
      }
    ]
  })
}
