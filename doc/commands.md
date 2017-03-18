# Commands and options

## Commands

### Generate code

```
avifors generate
```

### Print generators interface

The following command will print the arguments needed for each generator you registered, formatted in YAML:

```
avifors interface
```

For example, for the model used in `/example`, this command will prompt the following:

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

For getting the interface of a particular generator, let's say `entity`:

```
avifors interface event
```

The result of the command run above is the following:

```yaml
name: string
attributes:
  - string
```

## Options

There only one option currently available, `config`, which defines the path to your configuration path. Its default value is `./.avifors.yml`

```bash
avifors --config="mode/.avifors.yml" generate
```
