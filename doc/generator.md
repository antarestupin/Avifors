# Define a generator

Here's how to define a generator:

```javascript
module.exports.default = function(avifors) {
  avifors.setGenerator('event', {     // 'event' is the name of our generator
    list: "events",                   // 'events' is the name to use when listing events in a model file
    key: "name",                      // When using a list of events, the key used to identify an event will then be set as its 'name'

    arguments: {                      // Here we define the interface of the model definition, i.e. how to define an event
      name: avifors.type.string(),    // The name of the event is a string
      attributes: avifors.type.list(  // Here we want a list of maps as attributes
        avifors.type.map({
          name: avifors.type.string(), // The name of the attribute
          type: avifors.type.string() // Here we want either 'string', 'number' or 'boolean' as a value
        })
      )
    },

    outputs: [                                          // Here we define which files will be written for each event
      {
        path: "src/Event/{{ name | pascalcase }}.php",  // We want the file to have the name of the event PascalCased
        template: "generators/event/event.template.php" // This template will be used to generate the code
      }
    ]
  })
}
```

## Types

Here are the types included in Avifors out of the box:

- `string({ validators, builders } optional)`
- `number({ validators, builders } optional)`
- `boolean({ validators, builders } optional)`
- `list(children array, { validators, builders } optional)`
- `map(keys object, { validators, builders } optional)`
- `valueOrMap(defaultKey, keys object, { validators, builders } optional)`: in the model, the value can either be a map or a value that will be then transformed into a map with empty values excepted for the field `defaultKey`, which will be set to this value
- `optional.string`, `optional.number`, `optional.boolean`: these fields may not be provided in the model

You can also [add your own types](https://github.com/antarestupin/Avifors/tree/master/doc/plugins.md#define-new-types).

## Validators

The validators allow you to ensure your model cannot have a wrong definition. You can use it when declaring a type:

```javascript
avifors.type.string({ validators: [avifors.validators.enum(['string', 'number', 'boolean'])] })
```

## Provided validators

Here are the validators included in Avifors out of the box:

- `required()`
- `enum(values)`: the value can only be one of the values in `values`

## Creating a validator

You can also create your own validators:

```javascript
avifors.setValidator('positiveNumber', () => {  // 'positiveNumber' is the name of our validator
  normalize: () => '>= 0',                      // this is a short description used when printing the model interface
  validate: (value, path) => avifors.assert(    // this method validates the value in the model; 'path' provides the path to access the value in the model
    value >= 0,                                 // the actual validation, we want the value to be positive
    `${path} must be a positive number`         // the message to display if the value is incorrect
  )
})

// ...

avifors.type.number({ validators: [avifors.validators.positiveNumber()] })
```

## Builders

The builders allow you to ease the writing of the model by modifying values written in YAML files. For example, you can define default values for maps using `mapDefaultValues`:

```javascript
avifors.type.map({
  name: avifors.type.string(),
  age: avifors.type.number()
}, {
  validators: [
    avifors.validators.mapDefaultValues({
      age: 0
    })
  ]
})
```

This mechanic is also used under the hood by the `valueOrMap` type to transform a plain value into a map.

## Provided builders

Here are the builders included in Avifors out of the box:

- `mapDefaultValues(defaultFn values => object)`: allows to define default values for maps

## Creating a builder

You can also create your own builders:

```javascript
avifors.setBuilder(
  'addNamespace',                                 // the name of our validator
  namespace => value => namespace + '_' + value   // namespace is the argument to create the builder, which simply prepend it to the value
)

// ...

avifors.type.string({ builders: [avifors.builders.addNamespace('my_namespace')] })
```

Next: [Define an automatic generator](https://github.com/antarestupin/Avifors/tree/master/doc/auto-generators.md)
