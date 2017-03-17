export default class InterfacePrinter {
  constructor(avifors, yamlHelper) {
    this.avifors = avifors
    this.yamlHelper = yamlHelper
  }

  print() {
    return this.yamlHelper.print(this.avifors.generators.map(i => ({name: i.name, arguments: i.arguments.normalize()})))
  }

  printItem(name) {
    const item = this.avifors.generators.find(i => i.name === name)
    return this.yamlHelper.print(item.arguments.normalize())
  }
}
