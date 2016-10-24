const chalk = require('chalk')

module.exports = `
${chalk.bold.underline('Arguments:')}

${chalk.bgWhite.black('--avifors-src')} Sets the path to Avifors' configuration file (defaults to ${chalk.cyan('./.avifors.yaml')})
${chalk.bgWhite.black('--config-src')}  Sets the path to the configuration files
${chalk.bgWhite.black('--model-src')}   Sets the path to the model files
${chalk.bgWhite.black('--type')}        Sets the type of the item to generate
${chalk.bgWhite.black('--args')}        Sets the arguments of the item to generate (formatted in YAML)

${chalk.bold.underline('Requirements:')}

At least you have to indicate the path to the configuration files that will link your model with the implementation, using the ${chalk.cyan('--config-src')} option.

Note that you can put this info and others in your ${chalk.cyan('.avifors.yaml')} file in order to avoid repeating yourself.

${chalk.bold.underline('Examples:')}

Here are somes examples of how to use Avifors:

${chalk.gray('# You will be asked the type and arguments of the item to generate')}
${chalk.cyan('avifors')}

${chalk.gray('# Same as above, but with the type already filled')}
${chalk.cyan('avifors --type event')}
${chalk.cyan('avifors event')}

${chalk.gray('# Everything is already filled here')}
${chalk.cyan('avifors --type event --args "{name: user_created, attributes:[user_id, email_address]}"')}

${chalk.gray('# Here the data is in a YAML file (several items can be generated at once this way)')}
${chalk.cyan('avifors --model-src example/data.yaml')}

More information is available at ${chalk.underline('https://github.com/antarestupin/Avifors')}
`
