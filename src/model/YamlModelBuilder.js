import fs from 'fs'
import glob from 'glob'
import yaml from 'js-yaml'
import chalk from 'chalk'

export default class YamlModelBuilder {
  constructor(avifors, yamlHelper) {
    this.avifors = avifors
    this.yamlHelper = yamlHelper
  }

  build(paths) {
    return paths
      .map(path => glob.sync(path, { nodir: true })) // get the list of files matching given pattern
      .reduce((a,b) => a.concat(b)) // flatten it to one list
      .map(path => this.yamlHelper.readYamlFile(path))
      .map(modelConfig => this._normalizeModelConfig(modelConfig))
      .reduce((a,b) => a.concat(b))
  }

  /**
   * entities:
   *   User:
   *     properties: ...
   *
   * => [
   *   {
   *     type: 'entity',
   *     arguments: {
   *       name: 'User',
   *       properties: ...
   *     }
   *   }
   * ]
   */
  _normalizeModelConfig(modelConfig) {
    let name = Object.keys(modelConfig)[0]
    let [generator, isList] = this.avifors.getGenerator(name)

    if (isList) {
      // if the key is used as an argument
      if (!Array.isArray(modelConfig[name])) {
        let argsList = []
        for (let i in modelConfig[name]) {
          argsList.push({
            [generator.key]: i,
            ...modelConfig[name][i]
          })
        }
        modelConfig[name] = argsList
      }

      modelConfig[name] = modelConfig[name].map(args => this._executeConstructors(args))
      modelConfig[name].forEach(args => this._validateItem(args, generator))

      return modelConfig[name].map(args => ({
        type: generator.name,
        arguments: generator.arguments.build(args)
      }))
    }

    modelConfig[name] = this._executeConstructors(modelConfig[name])
    this._validateItem(modelConfig[name], generator)

    return [{
      type: name,
      arguments: generator.arguments.build(modelConfig[name])
    }]
  }

  _executeConstructors(item) {
    if (typeof item === 'string') {
      const constructor = item.match(/^\s*(\.\w+)+(\(.*\))?\s*$/)
      if (constructor !== null) {
        try {
          return eval("(this.avifors.constructors" + item + ")")
        } catch (exception) {
          throw `${chalk.bold.red('Error during constructor exectution')} - ${item}.\n\n${exception.message}`
        }
      }
    }

    if (Array.isArray(item)) {
      return item.map(i => this._executeConstructors(i))
    }

    if (typeof item === 'object' && item !== null) {
      let res = {}
      for (let i in item) {
        res[i] = this._executeConstructors(item[i])
      }
      return res
    }

    return item
  }

  _validateItem(args, generator) {
    try {
      generator.arguments.validate(args, '')
    } catch(e) {
      throw `${chalk.bold.red('Error during model item validation:')} ${e}\n\n`
        + `Item generating this error:\n\n`
        + this.yamlHelper.print(args)
    }
  }
}
