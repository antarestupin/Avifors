# Avifors plugins

The core concept of Avifors is plugins. They allow you to define generators in a modular way, using scripts like the following:

```javascript
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
```

The description of what's defined in this script is already in the [Getting started](https://github.com/antarestupin/Avifors/tree/master/doc/getting_started.md) section. Here we will give details about the `avifors` object and what it allows to do.

## Define generators

TODO

## Define new types

TODO

## Change environment of templates

TODO

## Define commands

TODO

## Load other plugins

TODO
