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
    }
  }

  for (let i in commands) {
    avifors.setCommand(i, commands[i])
  }
}
