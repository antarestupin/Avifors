const glob = require('glob')
const yaml = require('js-yaml')
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
        'g': 'generate',

        'interface': 'interface',
        'i': 'interface',

        'visualize': 'visualize',
        'v': 'visualize'
    }[givenCommand]

    if (!command) {
        throw exceptions.commandDoesNotExist(givenCommand)
    }

    argv['_'][0] = command
}

// Get the arguments needed
function sanitizeArgs(argv) {
    // command line argument
    transformCliArgs(argv)

    // merge file config & command line parameters
    mergeArgs(argv)

    let result = {
        config: configHelper.getConfig(argv['config-src']),
        global: argv.global || {},
        plugins: argv.plugins || []
    }

    result.model = getResultModel(argv, result)

    result.model = modelArgs.flattenModel(result.model, result.config)

    return result
}

function transformCliArgs(argv) {
    for (let i in argv) {
        // parse data arguments
        if (i == 'args') argv[i] = yaml.safeLoad(argv[i])

        // transform string argument lists into actual argument lists
        if (['model-src', 'config-src', 'plugins'].indexOf(i) > -1) {
            argv[i] = argv[i].split(',').map(path => path.trim())
        }
    }
}

function getAviforsFileConfig(argv) {
    if (!!argv['avifors-src']) {
        return helpers.readYaml(argv['avifors-src'])
    }

    if (helpers.fileExists('.avifors.yaml')) {
        return helpers.readYaml(argv['avifors-src'])
    }

    return {}
}

function mergeArgs(argv) {
    // get the avifors config file if it exists
    let aviforsFileConfig = getAviforsFileConfig(argv)

    for (let i in aviforsFileConfig) {
        let val = aviforsFileConfig[i]
        if (!argv[i]) {
            argv[i] = val
        }
        else {
            if (helpers.isScalar(val))  argv[i] = val
            if (Array.isArray(val))     argv[i] = argv[i].concat(val)
            else                        argv[i] = Object.assign({}, val, argv[i])
        }
    }
}

function getResultModel(argv, result) {
    return (!argv['model-src']) ? []: (argv['model-src'])
        .map(src => glob.sync(src, { nodir: true })) // get the list of files matching given pattern
        .reduce((a,b) => a.concat(b)) // flatten it to one list
        .map(src => helpers.readYaml(src))
        .map(item => {
            if (Array.isArray(item)) return item

            let res = []
            for (let i in item) {
                if (result.config[i].list) {
                    let configOriginItem = result.config[result.config[i].origin]
                    if (!Array.isArray(item[i])) {
                        let keyName = configOriginItem.arguments._key
                        let arrayItem = []

                        for (let j in item[i]) {
                            item[i][j][keyName] = j
                            arrayItem.push(item[i][j])
                        }

                        item[i] = arrayItem
                    }

                    item[i] = {
                        [i]: item[i]
                    }
                }

                res.push({
                    type: i,
                    arguments: item[i]
                })
            }
            return res
        })
        .reduce((a,b) => a.concat(b)) // merge the items
}
