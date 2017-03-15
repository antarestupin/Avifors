import yaml from 'js-yaml'
import chalk from 'chalk'

export default class InterfacePrinter {
  constructor(avifors) {
    this.avifors = avifors
  }

  print() {
    return this.serialize(this.avifors.generators.map(i => ({name: i.name, arguments: i.arguments.normalize()})))
  }

  printItem(name) {
    const item = this.avifors.generators.find(i => i.name === name)
    return this.serialize(item.arguments.normalize())
  }

  serialize(toSerialize) {
    return yaml.safeDump(toSerialize, {indent: 2, lineWidth: 120})
      .replace(/(\w+):/g, chalk.cyan('$1') + ':')
  }
}
