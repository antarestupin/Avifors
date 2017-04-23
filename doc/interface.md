# Print generators interfaces

As the different concepts in your model grow and become more complex, the generators specifications may become harder to read and understand when you just want to know how to structure an item. To help you in this case, the `interface` command prints the arguments needed for each generator you registered, in a readable format:

```
avifors interface
```

For example, in our case, this command will prompt something like the following:

```yaml
- name: event
  arguments:
    name: string
    attributes:
      - string
```

For getting only the interface of a specific generator (in our case there's no much choice so `event`), type its name as parameter:

```
avifors interface event
```

The result of the command run above is the following:

```yaml
name: string
attributes:
  - string
```

Next: [Avifors plugins](https://github.com/antarestupin/Avifors/tree/master/doc/plugins.md)
