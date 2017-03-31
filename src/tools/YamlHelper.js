import fs from 'fs'
import yaml from 'js-yaml'
import chalk from 'chalk'

export default class YamlHelper {
  // Reads and parse given YAML file
  readYamlFile(path) {
    try {
        return yaml.safeLoad(fs.readFileSync(path, 'utf8'))
    } catch (e) {
        if (e instanceof yaml.YAMLException) throw `Could not parse file ${path}.\nCause:\n\n${e.message}`
        else throw `Could not read file ${path}.`
    }
  }

  serialize(toSerialize) {
    return yaml.safeDump(toSerialize, {indent: 2, lineWidth: 120, skipInvalid: true})
  }

  print(toPrint) {
    return this.serialize(toPrint).replace(/(\w+):/g, chalk.cyan('$1') + ':')
  }
}
