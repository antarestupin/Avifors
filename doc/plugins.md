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
          type: avifors.type.string({validators: [avifors.validators.enum(['string', 'number', 'boolean'])]}) // Here we want either 'string', 'number' or 'boolean' as a value
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

For more details, see [Define a generator](https://github.com/antarestupin/Avifors/tree/master/doc/generator.md).

## Define queries

To create a query, use the `setQuery` method:

```javascript
avifors.setQuery(
  'entity:with-prop',                                       // The name of the query
  {
    description: 'List the entities having given property', // A short description of the query
    arguments: ['propName'],                                // The list of needed arguments for your query
    resolve: ({model}, {propName}) => model                 // The function resolving the query; first arguments is {avifors, model, argv} (argv is computed from substack/minimist); second argument contains your arguments
        .filter(i => i.type === 'entity' && i.arguments.properties.some(j => j.name === propName))
        .map(i => i.arguments.name)                         // Here we only want names of the entities
  }
)
```

This query takes one argument and lists the entities having a property wich name is equal to the argument.

## Define new types

You can define a type and use it in your generators. The following script is the definition of the `list` type:

```javascript
avifors.setType('list', (children, { validators = [], builders = [] } = {}) => ({ // 'list' is the name of our type
  type: 'list',                                                                   // This should be the same as the name of the type
  build: value => {                                                               // The function build is called when building the model to modify list values; it allows the use of more 'magic' types which make the model easier to read (like valueOrMap)
    let result = value.map(i => children.build(i))
    builders.forEach(builder => result = builder(result))
    return result
  },
  normalize: () => [children.normalize()],                                        // This function is called when retrieving the interface of the model item in order to serialize it
  validate: (i, path) => {                                                        // Validate given modem item
    avifors.assert(Array.isArray(i), `${path} must be a list, ${i} given`)        // Check that given item is an array
    avifors.validate(validators, i, path)                                         // Execute given validators
    i.forEach((v,j) => children.validate(v, `${path}[${j}]`))                     // Validate each children
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
avifors.setCommand('dump-avifors', ({avifors, model, argv}) => console.log(avifors)) // argv object is computed from substack/minimist
```

With this script, running `avifors dump-avifors` will print a dump of the avifors object.

## Load other plugins

It can be useful to load other plugins from your plugin. This can be done using the `loadPlugins` method:

```javascript
avifors.loadPlugins(['path/to/plugin'])
```
