import Avifors from '../Avifors'
import Configuration from '../Configuration'
import YamlModelBuilder from '../YamlModelBuilder'
import YamlHelper from '../tools/YamlHelper'
import Generator from '../commands/Generator'
import InterfacePrinter from '../commands/InterfacePrinter'

export function getConfiguration() {
  return new Configuration('./example/.avifors.yml', new YamlHelper())
}

export function getAvifors() {
  const avifors = new Avifors()

  const corePlugins = ['../model/plugin', '../template/plugin', '../commands/plugin']
  corePlugins.forEach(plugin => require(plugin).default(avifors))

  avifors.loadPlugins(getConfiguration().plugins)
  return avifors
}

export function getModelBuilder() {
  return new YamlModelBuilder(getAvifors(), new YamlHelper())
}

export function getModel() {
  return getModelBuilder().build(getConfiguration().modelFiles)
}

export function getGenerator() {
  return new Generator(getAvifors(), new YamlHelper())
}

export function getInterfacePrinter() {
  return new InterfacePrinter(getAvifors(), new YamlHelper())
}
