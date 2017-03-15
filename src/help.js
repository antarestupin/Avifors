import chalk from 'chalk'

export const helpMessage = `
Avifors is a tool to generate code from templates and separate your app model from its implementation.

${chalk.bold.underline('Usage')}: ${chalk.cyan('avifors [--config="./path/to/config"] [command]')}

${chalk.bold.underline('Commands')}:

  ${chalk.bgWhite.black('generate             ')} Generates the implementation (code) files from your model.
  ${chalk.bgWhite.black('interface [generator]')} Shows the interface of your generators; or the interface of given generator if given.

${chalk.bold.underline('Arguments')}:

  ${chalk.bgWhite.black('--config')} Sets the path to Avifors' configuration file (defaults to ${chalk.cyan('./.avifors.yaml')})

More information is available at ${chalk.underline('https://github.com/antarestupin/Avifors')}
`
