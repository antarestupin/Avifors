# Define the model

We will use the example of the event, so with the following generator:

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
