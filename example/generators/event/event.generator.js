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

  avifors.addAutoGenerator(model => [
    {
      path: "example/output/Events.php",
      template: "example/generators/event/events.template.php",
      variables: {
        events: model.filter(i => i.type === 'event').map(i => i.arguments)
      }
    }
  ])
}
