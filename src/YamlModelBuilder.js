import fs from 'fs'
import glob from 'glob'
import yaml from 'js-yaml'

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
    let [modelItem, isList] = this.avifors.getGenerator(name)

    if (isList) {
      // if the key is used as an argument
      if (!Array.isArray(modelConfig[name])) {
        let argsList = []
        for (let i in modelConfig[name]) {
          argsList.push({
            [modelItem.key]: i,
            ...modelConfig[name][i]
          })
        }
        modelConfig[name] = argsList
      }

      return modelConfig[name].map(args => ({
        type: modelItem.name,
        arguments: args
      }))
    }

    return [{
      type: name,
      arguments: modelConfig[name]
    }]
  }
}
