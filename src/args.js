const glob = require('glob')
const chalk = require('chalk')
const yaml = require('js-yaml')
const prompt = require('prompt-sync')({ sigint: true })
const exceptions = require('./exceptions')
const helpers = require('./helpers')
const configHelper = require('./config')
const modelArgs = require('./modelArgs')

module.exports = {
    sanitizeArgs: sanitizeArgs
}

// Get the arguments needed
function sanitizeArgs(argv) {
    // get the avifors config file if it exists
    if (!!argv['avifors-src']) Object.assign(argv, helpers.readYaml(argv['avifors-src']))
    else {
        let aviforsConfigRaw
        try { aviforsConfigRaw = fs.readFileSync('.avifors.yaml', 'utf8') } catch(e) {}
        if (aviforsConfigRaw) {
            try { Object.assign(argv, yaml.safeLoad(aviforsConfigRaw)) }
            catch (e) { throw exceptions.yamlLoadFile('.avifors.yaml', e) }
        }
    }

    // transform string lists of files into actual lists of files
    ['model-src', 'config-src'].forEach(i => {
        if (typeof argv[i] == 'string') argv[i] = argv[i].split(',').map(path => path.trim())
    })

    // determine the source of data
    let source = 'cli'
    if (!!argv['type'] && !!argv['args']) source = 'arguments'
    else if (!!argv['model-src'] && argv._.length == 0) source = 'file'

    let result = {
        config: configHelper.getConfig(argv['config-src']),
        source: source,
        global: argv.global || {}
    }

    result.model = (!argv['model-src']) ? []: (argv['model-src'])
        .map(src => glob.sync(src, { nodir: true })) // get the list of files matching given pattern
        .reduce((a,b) => a.concat(b)) // flatten it to one list
        .map(src => helpers.readYaml(src))
        .reduce((a,b) => a.concat(b)) // merge the items

    // get the data
    switch (source) {
        case 'cli':
            // item type
            let type = argv['type'] || argv._[0] || prompt('Type of the item to generate: ')
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
            break
        case 'file':
            result.data = result.model
            break
        case 'arguments':
            try {
                result.data = [{
                    type: argv['type'],
                    arguments: yaml.safeLoad(argv['args'])
                }]
            } catch (e) { throw exceptions.yamlLoadArgs(e) }
    }

    return result
}
