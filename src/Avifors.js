import nunjucks from 'nunjucks'
import glob from 'glob'

export default class Avifors {
  constructor() {
    this.generators = []
    this.commands = {}

    this.nunjucks = nunjucks.configure({
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true
    })

    this._initializeValidators()
    this._initializeTypes()
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
   * Set a command
   */
  setCommand(name, command) {
    this.commands[name] = command
  }

  /**
   * Get the command defined with given name
   */
  getCommand(name) {
    const command = this.commands[name]
    if (!command) {
      throw `Command ${name} does not exist.`
    }

    return command
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
   * Add core types
   */
  _initializeTypes() {
    this.types = {
      mixed: (validators = []) => ({ type: 'mixed', normalize: () => 'mixed', validate: (i, path) => this.validate(validators, i, path) }),

      list: (children, validators = []) => ({
        type: 'list',
        children: children,
        normalize: () => [children.normalize()],
        validate: (i, path) => {
          this.assert(Array.isArray(i), `${path} must be a list, ${i} given`)
          this.validate(validators, i, path)
          i.forEach((v,j) => children.validate(v, `${path}[${j}]`))
        }
      }),

      map: (keys, validators = []) => ({
        type: 'map',
        keys: keys,
        normalize: () => {
          let result = {}
          for (let i in keys) {
            result[i] = keys[i].normalize()
          }
          return result
        },
        validate: (i, path) => {
          this.assert(typeof i === 'object' && !Array.isArray(i), `${path} must be a map, ${i} given`)
          this.validate(validators, i, path)
          for (let j in i)    this.assert(j in keys, `Unexpected key "${j}" in ${path}`)
          for (let j in keys) keys[j].validate(i[j], `${path}.${j}`)
        }
      }),

      optional: {}
    }

    // Basic types
    const basicTypes = ['string', 'number', 'boolean']
    const buildBasicType = (type, optional) => (validators = []) => {
      if (!optional) {
        validators.push(this.validators.required())
      }

      return {
        type: type,
        normalize: () => type + (validators.length ? ` (${ validators.map(v => v.normalize()).join(', ') })`: ''),
        validate: (i, path) => {
          this.assert(typeof i === type || i == null, `${path} must be a ${type}, "${i}" given`)
          this.validate(validators, i, path)
        }
      }
    }

    basicTypes.forEach(type => {
      this.types[type] = buildBasicType(type, false)
      this.types.optional[type] = buildBasicType(type, true)
    })
  }

  /**
   * Add core validators
   */
  _initializeValidators() {
    this.validators = {
      required: () => ({
        normalize: () => 'required',
        validate: (i, path) => this.assert(i != null, `${path} must be defined`)
      })
    }
  }
}
