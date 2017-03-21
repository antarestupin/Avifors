# Avifors plugins

The core concept of Avifors is plugins. They allow you to define generators, commands, model types, validators...

Here we will give details about the `avifors` object and what it allows to do.

## Define generators

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
          type: avifors.type.string([avifors.validators.enum(['string', 'number', 'boolean'])]) // Here we want either 'string', 'number' or 'boolean' as a value
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

## Define new types

You can define a type and use it in your generators. The following script is the definition of the `list` type:

```javascript
avifors.setType('list', (children, validators = []) => ({                   // Types should always accept a validators parameters to allow further model validation
                                                                            // 'list' is the name of our type
  type: 'list',                                                             // This should be the same as the name of the validator
  normalize: () => [children.normalize()],                                  // This function is called when retrieving the interface of the model item in order to serialize it
  validate: (i, path) => {                                                  // Validate given modem item
    avifors.assert(Array.isArray(i), `${path} must be a list, ${i} given`)  // Check that given item is an array
    avifors.validate(validators, i, path)                                   // Execute given validators
    i.forEach((v,j) => children.validate(v, `${path}[${j}]`))               // Validate each children
  }
}))
```

## Change environment of templates

The following code adds a global variable named `global` in Nunjucks templates:

```javascript
avifors.nunjucks.addGlobal('global', {
  'companyName': 'ACME'
})
```

## Define commands

You can also define commands:

```javascript
avifors.setCommand('dumpAvifors', ({avifors, model, argv}) => console.log(avifors)) // argv object is computed from minimist
```

With this script, running `avifors dumpAvifors` will print a dump of the avifors object.

## Load other plugins

It can be useful to load other plugins from your plugin. This can be done using the `loadPlugins` method:

```javascript
avifors.loadPlugins(['path/to/plugin'])
```
