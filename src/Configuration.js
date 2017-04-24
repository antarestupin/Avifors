import check from 'check-types'
import chalk from 'chalk'

export default class Configuration {
  constructor(filePath = './.avifors.yml', yamlHelper) {
    const config = yamlHelper.readYamlFile(filePath)

    this._checkConfig(config)

    this.plugins = config.plugins
    this.modelFiles = config.model
  }

  _checkConfig(config) {
    if (!check.nonEmptyObject(config)) throw `The Avifors configuration file must contain fields ${chalk.underline('plugins')} and ${chalk.underline('model')}.`
    if (!check.nonEmptyArray(config.plugins)) throw `config.plugins must be a list containing the Avifors plugin files paths.`
    if (!check.nonEmptyArray(config.model)) throw `config.model must be a list containing the model definition files paths.`
  }
}
