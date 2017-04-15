# Commands and options

## Commands

### Generate code

```
avifors generate
```

### Print generators interface

The following command will print the arguments needed for each generator you registered, in a readable format:

```
avifors interface
```

For example, for the model used in `/example`, this command will prompt something like the following:

```yaml
- name: entity
  arguments:
    name: string
    properties:
      - name: string
        type: string
        description: string
- name: event
  arguments:
    name: string
    attributes:
      - string
```

For getting the interface of a particular generator, let's say `entity`, type:

```
avifors interface event
```

The result of the command run above is the following:

```yaml
name: string
attributes:
  - string
```

### Query the model

Your model can quickly become complex. To mitigate the issues of this fact, Avifors allows you to query the model you have defined.

To do this, you can create queries: they are simple Javascript function taking the model as an argument and returning a part of it (you will see later how to create them). For example, let's say we have created a query `entity:with-prop` which takes one argument and lists the entities having a property wich name is equal to the argument; you can call this query to get the entities having a `price` property this way:

```
avifors query entity:with-prop price
```

## Options

There only one option currently available, `config`, which defines the path to your configuration path. Its default value is `./.avifors.yml`

```bash
avifors --config="mode/.avifors.yml" generate
```

Next: [Define the model](https://github.com/antarestupin/Avifors/tree/master/doc/model.md)
