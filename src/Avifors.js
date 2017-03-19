import nunjucks from 'nunjucks'
import glob from 'glob'

export default class Avifors {
  constructor() {
    this.generators = []

    const emptyDicts = ['command', 'type', 'validator']
    emptyDicts.forEach(i => this._createProperty(i))

    this.nunjucks = nunjucks.configure({
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true
    })
  }

  /**
   * Set a generator
   */
  setGenerator(name, config) {
    config.outputs = config.outputs.map(i => typeof i === 'function' ? i: (args => ({path: this.nunjucks.renderString(i.path, args), template: i.template})))
    config.arguments = this.types.map(config.arguments)
    this.generators.push({
      name: name,
      ...config
    })
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
    paths
      .map(path => glob.sync(path, { nodir: true, absolute: true })) // get the list of files matching given pattern
      .reduce((a,b) => a.concat(b)) // flatten it to one list
      .forEach(pluginPath => require(pluginPath).default(this))
  }

  /**
   * Create an empty dict property with its getter, setter and hasser
   * Example: _createProperty('command') => this.commands = {}; this.getCommand(name); this.setCommand(name, command); this.hasCommand(name)
   */
  _createProperty(field) {
    const uppercased = field.charAt(0).toUpperCase() + field.substr(1)
    const plural = field + 's'
    this[plural] = {}
    this['set' + uppercased] = (name, value) => this[plural][name] = value
    this['get' + uppercased] = name => {
      if (!this['has' + uppercased](name)) {
        throw `${uppercased} ${name} does not exist.`
      }
      return this[plural][name]
    }
    this['has' + uppercased] = name => this[plural][name] !== undefined
  }
}
