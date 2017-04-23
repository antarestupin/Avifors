# Query the model

Your model can quickly become complex. To mitigate the issues of this fact, Avifors allows you to query the model you have defined.

To do this, you can create queries: they are simple Javascript function taking the model as an argument and returning a part of it. For example, let's say we want to be able, given an attribute, to list every event having this attribute. We will define our query this way:

```javascript
avifors.setQuery(
  'entity:with-attr',                                       // The name of the query
  {
    description: 'List the events having given attribute', // A short description of the query
    arguments: ['attrName'],                               // The list of needed arguments for your query
    resolve: ({model}, {attrName}) => model                // The function resolving the query; first arguments is {avifors, model, argv} (argv is computed from substack/minimist); second argument contains your arguments
        .filter(i => i.type === 'entity' && i.arguments.attributes.some(j => j.name === attrName))
        .map(i => i.arguments.name)                        // Here we only want names of the entities
  }
)
```

We can then use our query using the `query` command:

```
avifors query entity:with-attr user_id
```

This will print something like the following:

```yaml
- name: user_registered
  attributes:
    - user_id
    - email_address
    - password

- name: password_changed
  attributes:
    - user_id
    - new_password
```

Next: [Print generators interfaces](https://github.com/antarestupin/Avifors/tree/master/doc/interface.md)
