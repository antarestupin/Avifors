# Define the model

## Define lists of items

We will use the example of the event, so with the following generator:

```javascript
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

    // ...
  })
}

```

You can define an event this way:

```yaml
event:
  name: user_registered
  attributes: [user_id, email_address, encrypted_password]
```

But you can also define a list of events in one file, using the key `events`, as defined in the generator configuration:

```yaml
events:
  -
    name: user_registered
    attributes: [user_id, email_address, encrypted_password]
  -
    name: password_changed
    attributes: [user_id, encrypted_new_password]
```

And as the key `name` as been defined as main key in the configuration, you can list the events by their name, in order to make the result more readable:

```yaml
events:
  user_registered:
    attributes: [user_id, email_address, encrypted_password]

  password_changed:
    attributes: [user_id, encrypted_new_password]
```

## Use constructors

In this example we use the model item `entity`:

```javascript
avifors.setGenerator('entity', {
  // ...

  arguments: {
    name: avifors.types.string(),
    properties: avifors.types.list(
      avifors.types.map({
        "name": avifors.types.string(),
        "type": avifors.types.string({validators: [avifors.validators.enum(['string', 'number', 'boolean'])]}),
        "constraints": avifors.types.list(
          avifors.types.map({
            "type": avifors.types.string()
          }, { strict: false })
        )
      })
    )
  },

  // ...
})
```

In the entity properties, we added a `constraints` field, which is a map containing at least a `type` field. This field defines constraints that should be respected for properties values.

For example, for a `User` entity, we may want the username to have a length between 5 and 20 characters, so we could define the constraint like this:

```yaml
entities:
  User:
    properties:
      - name: username
        type: string
        constraints:
          - type: between
            min: 5
            max: 20
```

Although this is readable, we could have a more concise, yet still readable definition of the constraint using a constructor.

First you need to define the constructor in your Avifors plugin:

```javascript
avifors.constructors.constraints = {
  between: (min, max) => ({
    type: 'between',
    min: min,
    max: max
  })
}
```

Then, to use it in your model, call it like this:

```yaml
entities:
  User:
    properties:
      - name: username
        type: string
        constraints:
          - .constraints.between(0,1)
```

As you can see, the pattern is simple: begin the definition with a dot, then call the method like in Javascript (actually it is JS under the hood). The method call string will be converted before the model validation.

Next: [Define a generator](https://github.com/antarestupin/Avifors/tree/master/doc/generator.md)
