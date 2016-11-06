const glob = require('glob')
const chalk = require('chalk')
const yaml = require('js-yaml')
const prompt = require('prompt-sync')({ sigint: true })
const exceptions = require('./exceptions')
const helpers = require('./helpers')
const configHelper = require('./config')
const modelArgs = require('./modelArgs')

module.exports = {
    sanitizeArgs: sanitizeArgs,
    setCommand: setCommand
}

// Get the command to call from the arguments ('generate' per default)
function setCommand(argv) {
    let givenCommand = argv['_'][0] || 'generate'

    let command = {
        'help': 'help',
        'h': 'help',

        'generate': 'generate',
        'g': 'generate'
    }[givenCommand]

    if (!command) {
        throw exceptions.commandDoesNotExist(command)
    }

    argv['_'][0] = command
}

// Get the arguments needed
function sanitizeArgs(argv) {
    // command line argument
    for (let i in argv) {
        // parse data arguments
        if (i == 'args') argv[i] = yaml.safeLoad(argv[i])

        // transform string argument lists into actual argument lists
        if (['model-src', 'config-src', 'plugins'].indexOf(i) > -1) {
            argv[i] = argv[i].split(',').map(path => path.trim())
        }
    }

    // get the avifors config file if it exists
    let aviforsFileConfig = {}
    if (!!argv['avifors-src']) aviforsFileConfig = helpers.readYaml(argv['avifors-src'])
    else if (helpers.fileExists('.avifors.yaml')) aviforsFileConfig = helpers.readYaml(argv['avifors-src'])

    // merge file config & command line parameters
    for (let i in aviforsFileConfig) {
        let val = aviforsFileConfig[i]
        if (!argv[i]) argv[i] = val
        else {
            if (helpers.isScalar(val)) argv[i] = val
            if (Array.isArray(val)) argv[i] = argv[i].concat(val)
            else argv[i] = Object.assign({}, val, argv[i])
        }
    }

    // determine the source of data
    let source = 'cli'
    if (!!argv['type'] && !!argv['args']) source = 'arguments'
    else if (!!argv['model-src'] && argv._.length == 1) source = 'file'

    let result = {
        config: configHelper.getConfig(argv['config-src']),
        source: source,
        global: argv.global || {},
        plugins: argv.plugins || []
    }

    result.model = (!argv['model-src']) ? []: (argv['model-src'])
        .map(src => glob.sync(src, { nodir: true })) // get the list of files matching given pattern
        .reduce((a,b) => a.concat(b)) // flatten it to one list
        .map(src => helpers.readYaml(src))
        .reduce((a,b) => a.concat(b)) // merge the items
    result.model = modelArgs.flattenModel(result.model, result.config)

    // get the data
    switch (source) {
        case 'cli':
            // item type
            let type = argv['type'] || argv._[1] || prompt('Type of the item to generate: ')
            while (!result.config[type]) {
                console.log(chalk.red('Type ' + type + ' does not exist in configuration'))
                type = prompt('Type of the item to generate: ')
            }

            // item arguments
            let args
            let argsConfirmed = false
            while (!argsConfirmed) {
                args = modelArgs.askForArgs(result.config[type].arguments)
                console.log('\n' + chalk.underline.cyan('Item arguments:') + '\n\n' + chalk.cyan(yaml.safeDump(args) + '\n'))
                switch (prompt('Do you confirm the item arguments? (Y/n)').toUpperCase()) {
                    case 'N':
                    case 'NO':
                        argsConfirmed = false
                        break;
                    case 'Y':
                    case 'YES':
                    default:
                        argsConfirmed = true
                }
            }

            result.data = [{
                type: type,
                arguments: args
            }]
            result.data = modelArgs.flattenModel(result.data, result.config)
            break
        case 'file':
            result.data = result.model
            break
        case 'arguments':
            try {
                result.data = [{
                    type: argv['type'],
                    arguments: argv['args']
                }]
                result.data = modelArgs.flattenModel(result.data, result.config)
            } catch (e) { throw exceptions.yamlLoadArgs(e) }
    }

    // can happen if the source is 'cli' or 'arguments'
    if (!Array.isArray(result.data)) {
        result.data = [result.data]
    }

    return result
}
