# Types, validators and builders

## Types

### Provided types

Here are the types included in Avifors out of the box:

- `string({ validators, builders } optional)`
- `number({ validators, builders } optional)`
- `boolean({ validators, builders } optional)`
- `list(children array, { validators, builders } optional)`
- `map(keys object, { validators, builders, defaults: value => object = () => ({}), strict: bool = true } optional)`: defaults will return an object with the default values of the map; if strict is set to true, no key not in `keys` can be added in the map
- `oneOf(types array, builder (value, typeIndex) => mixed)`: the model value can be of one of given types; the builder function takes the value and the index of which type it is and returns the final value

### The `oneOf` type

It might be useful to take time to explain the `oneOf` type here. Although this type is quite simple, it can add flexibility to the model specification, and thus allow you to write a cleaner model.

A common use case for the `oneOf` type is when you want a type to be a map, but with most of the time only one of its fields to be relevant. For example, remember the new `constraints` field added in our events which made us change the events attributes into maps. By using `oneOf`, we are able to use a map only when needed, and use a string to directly set the attribute name when there is no constraints.

This is how we could do that:

```javascript
avifors.setGenerator('entity', {
  // ...

  arguments: {
    name: avifors.types.string(),
    attributes: avifors.types.list(
      avifors.types.oneOf([                                         // The first argument is a list of possible types
        avifors.types.string(),                                     // If we only want the name of the attribute, then a string is enough
        avifors.types.map({                                         // If we want more details, then we will use a map
          name: avifors.types.string(),
          constraints: avifors.types.list(constraint())
        }, { defaults: { constraints: [] } })
      ], (value, typeIndex) => !typeIndex ? { name: value }: value) // This function will be called to build the final value
    )                                                               // typeIndex is the index corresponding to the types given as first argument; it will be 0 if the value is a string, or 1 if it is a map
  },

  // ...
})
```

In this example, as there are only two possible types, the builder function is quite simple:

- it inverses the value of typeIndex (0 becomes 1 (== true) and 1 becomes 0 (== false)) so that we can treat the value regarding its type in the same order than in the order of the types in the first argument,
- if it's a string, then it return a map with a name corresponding to the value,
- or if it's a map, it returns directly the value

With this change, now the events definition can be made simpler:

```yaml
events:
  user_registered:
    attributes:
      - user_id
      - email_address
      - name: password
        constraints:
          - .constraints.lengthBetween(0,1)

  password_changed:
    attributes: [user_id, new_password]
```

### Creating a type

You can also define your own types and use them in your generators. For example, the following script is the definition of the `list` type:

```javascript
avifors.setType('list', (children, { validators = [], builders = [] } = {}) => ({ // 'list' is the name of our type
  type: 'list',                                                                   // This should be the same as the name of the type
  build: value => {                                                               // This function is called before other builders, as it is a list, it should call its children's builders; it must return the final value
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

## Validators

The validators allow you to ensure your model cannot have a wrong definition. You can use it when declaring a type in your spec:

```javascript
avifors.type.string({ validators: [avifors.validators.enum(['string', 'number', 'boolean'])] })
```

### Provided validators

Here are the validators included in Avifors out of the box:

- `required()`
- `enum(values)`: the value can only be one of the values in `values`

### Creating a validator

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

The builders allow you to ease the writing of the model by modifying values written in YAML files.

```javascript
avifors.type.map({
  name: avifors.type.string(),
  age: avifors.type.number()
}, {
  strict: false,
  validators: [
    value => ({ username: value.name + value.age, ...value })
  ]
})
```

### Provided builders

There is currently no provided builder out of the box yet.

### Creating a builder

You can also create your own builders:

```javascript
avifors.setBuilder(
  'addNamespace',                                 // the name of our validator
  namespace => value => namespace + '_' + value   // namespace is the argument to create the builder, which simply prepend it to the value
)

// ...

avifors.type.string({ builders: [avifors.builders.addNamespace('my_namespace')] })
```

Next: [Query the model](https://github.com/antarestupin/Avifors/tree/master/doc/queries.md)
