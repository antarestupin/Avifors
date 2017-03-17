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

    this.type = {
      mixed:   () => ({type: 'mixed',   normalize: () => 'mixed',   validate: () => {} }),
      string:  () => ({type: 'string',  normalize: () => 'string',  validate: (i, path) => assert(typeof i === 'string', `${path} must be a string, "${i}" given`)   }),
      number:  () => ({type: 'number',  normalize: () => 'number',  validate: (i, path) => assert(typeof i === 'number', `${path} must be a number, "${i}" given`)   }),
      boolean: () => ({type: 'boolean', normalize: () => 'boolean', validate: (i, path) => assert(typeof i === 'boolean', `${path} must be a boolean, "${i}" given`) }),
      list: children => ({
        type: 'list',
        children: children,
        normalize: () => [children.normalize()],
        validate: (i, path) => {
          assert(Array.isArray(i), `${path} must be a list, ${i} given`)
          i.every((v,j) => children.validate(v, `${path}[${j}]`))
        }
      }),
      map: keys => ({
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
          assert(typeof i === 'object' && !Array.isArray(i), `${path} must be a map, ${i} given`)
          for (let j in i) {
            assert(j in keys, `Unexpected key "${j}" in ${path}`)
            keys[j].validate(i[j], `${path}.${j}`)
          }
        }
      }),

      assert: assert
    }
  }

  setGenerator(name, config) {
    config.outputs = config.outputs.map(i => typeof i === 'function' ? i: (args => ({path: this.nunjucks.renderString(i.path, args), template: i.template})))
    config.arguments = this.type.map(config.arguments)
    this.generators.push({
      name: name,
      ...config
    })
  }

  setCommand(name, command) {
    this.commands[name] = command
  }

  getCommand(name) {
    if (!name) {
      throw 'No command has been given.'
    }

    const command = this.commands[name]
    if (!command) {
      throw `Command ${name} does not exist.`
    }

    return command
  }

  /**
   * @return [modelItem dict, list bool]
   */
  getGenerator(name) {
    let isList = false
    let modelItem = this.generators.find(generator => generator.name === name)
    if (modelItem !== undefined) {
      return [modelItem, isList]
    }

    isList = true
    modelItem = this.generators.find(generator => generator.list === name)
    if (modelItem !== undefined) {
      return [modelItem, isList]
    }

    throw `Generator ${name} not found.`
  }

  loadPlugins(paths) {
    paths
      .map(path => glob.sync(path, { nodir: true, absolute: true })) // get the list of files matching given pattern
      .reduce((a,b) => a.concat(b)) // flatten it to one list
      .forEach(pluginPath => require(pluginPath).default(this))
  }
}

function assert(predicate, message) {
  if (!predicate) {
    throw message
  }
}
