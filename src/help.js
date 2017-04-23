import chalk from 'chalk'

export const helpMessage = `
Avifors is a MDE tool that generates code from a YAML definition of your app domain model.

${chalk.bold.underline('Usage')}: ${chalk.cyan('avifors [--config="./path/to/config"] [command]')}

${chalk.bold.underline('Commands')}:

  ${chalk.bold.white('generate             ')} Generates the implementation (code) files from your model.
  ${chalk.bold.white('help                 ')} Displays this message.
  ${chalk.bold.white('interface [generator]')} Shows the interface of your generators; or the interface of given generator if given.
  ${chalk.bold.white('query     [queryName]')} Resolves given query to the model and prints the result.

${chalk.bold.underline('Arguments')}:

  ${chalk.bold.white('--config')} Sets the path to Avifors' configuration file (defaults to ${chalk.cyan('./.avifors.yml')})

More information is available at ${chalk.underline('https://github.com/antarestupin/Avifors')}
`
