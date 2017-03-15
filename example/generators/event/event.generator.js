module.exports.default = function(avifors) {
  avifors.setGenerator('event', {
    list: "events",
    key: "name",

    arguments: {
      name: avifors.type.string(),
      attributes: avifors.type.list(
        avifors.type.string()
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
