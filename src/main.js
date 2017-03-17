#! /usr/bin/env node

import minimist from 'minimist'
import Avifors from './Avifors'
import YamlModelBuilder from './YamlModelBuilder'
import Configuration from './Configuration'
import {helpMessage} from './help'
import YamlHelper from './tools/YamlHelper'

const avifors = new Avifors()
const corePlugins = ['./template/plugin', './commands/plugin']
corePlugins.forEach(plugin => require(plugin).default(avifors))

const argv = minimist(process.argv.slice(2))
const userCommand = argv._[0]
if (userCommand === undefined || userCommand === 'help') {
  console.log(helpMessage)
} else {
  const yamlHelper = new YamlHelper()
  const config = new Configuration(argv.config, yamlHelper)

  avifors.loadPlugins(config.plugins)
  // console.log(avifors.generators)

  const modelBuilder = new YamlModelBuilder(avifors, yamlHelper)
  const model = modelBuilder.build(config.modelFiles)
  // console.log(model)

  avifors.getCommand(userCommand)({
    avifors: avifors,
    model: model,
    argv: argv
  })
}
