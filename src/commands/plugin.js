import Generator from './Generator'
import InterfacePrinter from './InterfacePrinter'
import YamlHelper from '../tools/YamlHelper'

export default function(avifors) {
  const commands = {
    generate: ({avifors, model}) => {
      const generator = new Generator(avifors, new YamlHelper())
      generator.generate(model)
    },

    interface: ({avifors, argv}) => {
      const interfacePrinter = new InterfacePrinter(avifors, new YamlHelper())
      if (argv._[1] !== undefined) {
        console.log(interfacePrinter.printItem(argv._[1]))
      } else {
        console.log(interfacePrinter.print())
      }
    },

    query: ({avifors, model, argv}) => {
      const queryName = argv._[1]
      if (queryName === undefined) {
        avifors.helpers.printYaml(Object.keys(avifors.queries))
        return
      }

      avifors.helpers.printYaml(avifors.getQuery(queryName)({
        model: model,
        argv: argv._.slice(2),
        avifors: avifors
      }))
    }
  }

  for (let i in commands) {
    avifors.setCommand(i, commands[i])
  }
}
