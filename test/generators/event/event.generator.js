module.exports.default = function(avifors) {
  avifors.setGenerator('event', {
    list: "events",
    key: "name",

    arguments: {
      name: avifors.types.string({builders: [value => 'my_namespace_'+value]}),
      attributes: avifors.types.list(
        avifors.types.string()
      )
    },

    outputs: [
      {
        path: "test/output/Event/{{ name | pascalcase }}.php",
        template: "test/generators/event/event.template.php"
      }
    ]
  })

  avifors.addAutoGenerator(model => [
    {
      path: "test/output/Events.php",
      template: "test/generators/event/events.template.php",
      variables: {
        events: model.filter(i => i.type === 'event').map(i => i.arguments)
      }
    }
  ])
}
