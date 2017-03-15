import fs from 'fs'
import yaml from 'js-yaml'

export default class Configuration {
  constructor(filePath = './.avifors.yaml') {
    const config = this._readYamlFile(filePath)
    this.plugins = config.plugins
    this.modelFiles = config.model
  }

  // Reads and parse given YAML file
  _readYamlFile(path) {
    try {
        return yaml.safeLoad(fs.readFileSync(path, 'utf8'))
    } catch (e) {
        if (e instanceof yaml.YAMLException) throw `Could not parse file ${path}.\nCause:\n\n${e.message}`
        else throw `Could not read file ${path}.`
    }
  }
}
