const chalk = require('chalk')
const yaml = require('js-yaml')
const prompt = require('../common/container').prompt
const exceptions = require('../common/exceptions')
const modelArgs = require('../common/modelArgs')

module.exports = {
    setData: setData
}

function setData(argsConfig, argv) {
    // determine the source of data
    let source = getDataSource(argv)

    // get the data
    switch (source) {
        case 'cli':
            getCliData(argv, argsConfig)
            break
        case 'file':
            argsConfig.data = argsConfig.model
            break
        case 'arguments':
            getArgumentsData(argv, argsConfig)
    }

    // can happen if the source is 'cli' or 'arguments'
    if (!Array.isArray(argsConfig.data)) {
        argsConfig.data = [argsConfig.data]
    }
}

function getDataSource(argv) {
    if (!!argv['type'] && !!argv['args']) {
        return 'arguments'
    }

    if (!!argv['model-src'] && argv._.length == 1) {
        return 'file'
    }

    return 'cli'
}

function getCliData(argv, argsConfig) {
    // item type
    let type = argv['type'] || argv._[1] || prompt('Type of the item to generate: ')
    while (!argsConfig.config[type]) {
        console.log(chalk.red('Type ' + type + ' does not exist in configuration'))
        type = prompt('Type of the item to generate: ')
    }

    // item arguments
    let args
    let argsConfirmed = false
    while (!argsConfirmed) {
        args = modelArgs.askForArgs(argsConfig.config[type].arguments)
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

    argsConfig.data = [{
        type: type,
        arguments: args
    }]
    argsConfig.data = modelArgs.flattenModel(argsConfig.data, argsConfig.config)
}

function getArgumentsData(argv, argsConfig) {
    try {
        argsConfig.data = [{
            type: argv['type'],
            arguments: argv['args']
        }]
        argsConfig.data = modelArgs.flattenModel(argsConfig.data, argsConfig.config)
    } catch (e) {
        throw exceptions.yamlLoadArgs(e)
    }
}
