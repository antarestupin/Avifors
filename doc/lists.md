# Define lists of items

As events are very simple to define we can group them in files by categories. In this example we will group the events related to user accounts.

## Define lists of items

Remember how we defined the event model item:

```javascript
module.exports.default = function(avifors) {
  avifors.setGenerator('event', {
    list: "events",
    key: "name",

    // ...
  })
}

```

With this setup we defined our first event this way:

```yaml
event:
  name: user_registered
  attributes: [user_id, email_address, password]
```

But you can also define a list of events in one file, using the key `events`, as defined in the generator configuration:

```yaml
events:
  - name: user_registered
    attributes: [user_id, email_address, password]

  - name: password_changed
    attributes: [user_id, new_password]
```

And as the key `name` as been defined as main key in the configuration, you can list the events by their name, in order to make the result more readable:

```yaml
events:
  user_registered:
    attributes: [user_id, email_address, password]

  password_changed:
    attributes: [user_id, new_password]
```

You can create a file named `user.model.yml` in `model/events` with this contents.

Next: [Use automatic generators](https://github.com/antarestupin/Avifors/tree/master/doc/auto-generators.md)
