# Avifors plugins

The core concept of Avifors is plugins. They allow you to define generators, commands, model types, validators...

Here we will give details about the `avifors` object and what it allows to do.

## Define generators

See [Getting started](https://github.com/antarestupin/Avifors/tree/master/doc/getting_started.md#define-a-first-generator).

## Define queries

See [Query the model](https://github.com/antarestupin/Avifors/tree/master/doc/queries.md).

## Define new types, validators and builders

See [Types, validators and builders](https://github.com/antarestupin/Avifors/tree/master/doc/types-validators-builders.md).

## Change environment of templates

Avifors exposes the Nunjucks env object, so that you can modify it to your needs.

The following code adds a global variable named `global` in Nunjucks templates:

```javascript
avifors.nunjucks.addGlobal('global', {
  'companyName': 'ACME'
})
```

You can also add custom functions this way:

```javascript
avifors.nunjucks.addGlobal('hello', name => `Hello ${name}!`)
```

Finally, you can add Nunjucks filters:

```javascript
avifors.nunjucks.addFilter('hello', name => `Hello ${name}!`)
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

Next: [Nunjucks templates environment](https://github.com/antarestupin/Avifors/tree/master/doc/templates.md)
