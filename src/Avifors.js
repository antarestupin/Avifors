import nunjucks from 'nunjucks'
import glob from 'glob'
import check from 'check-types'
import chalk from 'chalk'
import YamlHelper from './tools/YamlHelper'

export default class Avifors {
  constructor() {
    this.generators = []
    this.autoGenerators = []
    this.autoGeneratorBuilders = []
    this.constructors = {}
    this.model = null // will be defined by the model builder

    const assertArg = (value, cond, fnName, msg) => this.assert(cond, `avifors.${fnName}(): ${msg}, ${value} provided`)
    const emptyDicts = ['command', 'type', 'validator', 'builder']
    emptyDicts.forEach(i => this._createProperty(i, (commandName, value) => assertArg(value, check.function(value), commandName, `the ${i} must be a function`)))

    this._createProperty('query', (commandName, value) => {
      assertArg(value, check.nonEmptyObject(value), commandName, 'the query must be an object')
      assertArg(value, check.maybe.string(value.description), commandName, 'query.description must be a string')
      assertArg(value, check.maybe.array(value.arguments), commandName, 'query.arguments must be an array')
      assertArg(value, check.function(value.resolve), commandName, 'query.resolve must be a function')
    }, 'queries')

    this.nunjucks = nunjucks.configure({
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true
    })

    this.helpers = {
      printYaml: obj => console.log((new YamlHelper()).print(obj))
    }
  }

  /**
   * Set a generator
   */
  setGenerator(name, config) {
    this._checkSetGeneratorArguments(name, config)

    if (check.array(config.outputs)) {
      const outputs = config.outputs.map(i => typeof i === 'function' ? i: (args => ({path: this.nunjucks.renderString(i.path, args), template: i.template})))
      config.outputs = () => outputs
    }
    config.arguments = this.types.map(config.arguments)
    this.generators.push({
      name: name,
      ...config
    })
  }

  _checkSetGeneratorArguments(name, config) {
    const badCallExceptionMessage = msg => `${chalk.cyan(`Avifors.setGenerator('${name}', config):`)} ${msg}`
    this.assert(check.nonEmptyString(name), badCallExceptionMessage(`Generator name must be an non empty string`))
    this.assert(check.nonEmptyObject(config), badCallExceptionMessage(`config must be an non empty object and contain at least 'arguments' and 'outputs'`))
    this.assert(check.maybe.nonEmptyString(config.list), badCallExceptionMessage(`config.list must be a non empty string`))
    this.assert(check.maybe.nonEmptyString(config.key), badCallExceptionMessage(`config.key must be a non empty string`))
    this.assert(check.object(config.arguments), badCallExceptionMessage(`config.key must be a non empty object`))
    if (check.array(config.outputs)) {
      config.outputs.forEach((i, index) => this.assert(
        check.function(i) || (check.object(i) && check.nonEmptyString(i.path) && check.nonEmptyString(i.template)),
        badCallExceptionMessage(`config.key[${index}] must be an object containing non empty strings 'path' and 'template' or a function returning the above object`))
      )
    } else {
      this.assert(check.function(config.outputs), badCallExceptionMessage(`config.outputs must be an array or a function returning an array of outputs`))
    }
  }

  /**
   * Get the generator defined with given name, and say if given name refers to a list of items
   * @return [generator dict, list bool]
   */
  getGenerator(name) {
    let isList = false
    let generator = this.generators.find(gen => gen.name === name)
    if (generator !== undefined) {
      return [generator, isList]
    }

    isList = true
    generator = this.generators.find(gen => gen.list === name)
    if (generator !== undefined) {
      return [generator, isList]
    }

    throw `Generator ${name} not found.`
  }

  /**
   * Add a generator that will be executed without model definition
   * @param builder: model => [{path: string, template: string, variables: {}}]
   */
  addAutoGenerator(builder) {
    this.assert(check.function(builder), `avifors.addAutoGenerator(builder): builder must be a function, ${builder} provided`)
    this.autoGeneratorBuilders.push(builder)
  }

  /**
   * Set the model once it's built
   */
  setModel(model) {
    this.model = model
    this.nunjucks.addGlobal('model', model)
    this.autoGenerators = this.autoGeneratorBuilders.map(i => i(model))
  }

  /**
   * Quick way to assert a predicate
   */
  assert(predicate, message) {
    if (!predicate) {
      throw message
    }
  }

  /**
   * Validate given item using given validators
   */
  validate(validators, item, path) {
    validators.forEach(v => v.validate(item, path))
  }

  /**
   * Load plugins at given paths
   */
  loadPlugins(paths) {
    this.assert(check.array(paths), `loadPlugins(paths): paths must be an array of strings, ${paths} provided`)
    paths.forEach((i,index) => this.assert(check.string(i), `loadPlugins(paths): every path must be a string, ${i} provided`))

    paths
      .map(path => glob.sync(path, { nodir: true, absolute: true })) // get the list of files matching given pattern
      .reduce((a,b) => a.concat(b)) // flatten it to one list
      .forEach(pluginPath => require(pluginPath).default(this))
  }

  /**
   * Create an empty dict property with its getter, setter and hasser
   * Example: _createProperty('command') => this.commands = {}; this.getCommand(name); this.setCommand(name, command); this.hasCommand(name)
   */
  _createProperty(field, validator = null, pluralForm = null) {
    const uppercased = field.charAt(0).toUpperCase() + field.substr(1)
    const plural = pluralForm ? pluralForm: field + 's'
    this[plural] = {}
    this['set' + uppercased] = (name, value) => {
      validator('set' + uppercased, value)
      this[plural][name] = value
    }
    this['get' + uppercased] = name => {
      if (!this['has' + uppercased](name)) {
        throw `${uppercased} ${name} does not exist.`
      }
      return this[plural][name]
    }
    this['has' + uppercased] = name => this[plural][name] !== undefined
  }
}
