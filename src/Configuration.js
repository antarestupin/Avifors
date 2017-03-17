export default class Configuration {
  constructor(filePath = './.avifors.yaml', yamlHelper) {
    const config = yamlHelper.readYamlFile(filePath)
    this.plugins = config.plugins
    this.modelFiles = config.model
  }
}
