#! /usr/bin/env node

const nunjucks = require('nunjucks')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const prompt = require('prompt-sync')()
const mkdirp = require('mkdirp')
const filtersBuilder = require('./filters')
const glob = require('glob')

const nunjucksEnv = nunjucks.configure({ autoescape: false })
main(argv)

function main(argv) {
    if ('h' in argv || 'help' in argv) {
        console.log(`
Arguments:

--avifors-src Sets the path to Avifors' configuration file (defaults to ./.avifors.yaml)
--config-src  Sets the path to the configuration files
--model-src   Sets the path to the model files
--type        Sets the type of the item to generate
--args        Sets the arguments of the item to generate (formatted in JSON)

Here are 4 examples of how to use Avifors:

# you will be asked the type and arguments of the item to generate
avifors

# same as above, but with the type already filled
avifors --type event
avifors event

# everything is already filled here
avifors --type event --args "{\"name\": \"user_created\", \"attributes\":[\"user_id\"]}"

# here the data is in a YAML file (several items can be generated at once this way)
avifors --model-src example/data.yaml

More information at https://github.com/antarestupin/Avifors
`)

        return
    }

    let args = sanitizeArgs(argv)
    let filters = filtersBuilder(args.model)
    for (i in filters) nunjucksEnv.addFilter(i, filters[i])
    generate(args.config, args.data)
}

// Get the arguments needed
function sanitizeArgs(argv) {
    // get the avifors config file if it exists
    try {
        Object.assign(argv, readYaml(argv['avifors-src'] || '.avifors.yaml'))
    } catch (e) {}

    // transform string lists of files into actual lists of files
    ['model-src', 'config-src'].forEach(i => {
        if (typeof argv[i] == 'string') argv[i] = argv[i].split(',').map(path => path.trim())
    })

    // determine the source of data
    let source = 'cli'
    if (!!argv['type'] && !!argv['args']) source = 'arguments'
    else if (!!argv['model-src'] && argv._.length == 0) source = 'file'

    let result = {
        config: getConfig(argv['config-src']),
        source: source
    }

    if (!argv['model-src']) argv['model-src'] = []
    result.model = (argv['model-src'])
        .map(src => glob.sync(src, { nodir: true })) // get the list of files matching given pattern
        .reduce((a,b) => a.concat(b)) // flatten it to one list
        .map(src => readYaml(src))
        .reduce((a,b) => a.concat(b)) // merge the items

    // get the data
    switch (source) {
        case 'cli':
            let type = argv['type'] || argv._[0] || prompt('Type of the item to generate: ')
            result.data = [{
                type: type,
                arguments: askForArgs(result.config[type].arguments)
            }]
            break
        case 'file':
            result.data = result.model
            break
        case 'arguments':
            result.data = [{
                type: argv['type'],
                arguments: JSON.parse(argv['args'])
            }]
    }

    return result
}

// Generate the code
function generate(config, data) {
    data.forEach(item => {
        // case in which the type is a list of items of another type
        if (config[item.type].list) {
            config[item.type].outputs = []
            item.arguments[item.type].forEach(argItem => {
                config[item.type].originOutputs.forEach(output => {
                    config[item.type].outputs.push({
                        template: nunjucksEnv.renderString(output.template, argItem),
                        arguments: argItem,
                        output: nunjucksEnv.renderString(output.output, argItem)
                    })
                })
            })
        }

        // compute the outputs defined by a template
        if (typeof config[item.type].outputs == 'string') {
            config[item.type].outputs = yaml.safeLoad(
                nunjucksEnv.renderString(config[item.type].outputs, item.arguments)
            )
        }

        config[item.type].outputs.forEach(output => {
            // every argument is passed by default
            if (!output.arguments) {
                output.arguments = item.arguments
                output.arguments.globals = item.arguments
            }

            let templatePath = nunjucksEnv.renderString(output.template, item.arguments)
            let outputPath = nunjucksEnv.renderString(output.output, output.arguments)

            let rendered = nunjucksEnv.render(templatePath, output.arguments)

            writeFile(outputPath, rendered)
        })
    })
}

// Ask for the item arguments to the user
function askForArgs(schema, namespace = '') {
    // string
    if (typeof schema == 'string') {
        return prompt('Value of ' + namespace + ': ')
    }

    // list
    if (Array.isArray(schema)) {
        let args = []

        if (typeof schema[0] == 'string') { // list of strings
            for (let continueAdding = true; continueAdding;) {
                let newVal = prompt('Add a value to ' + namespace + ' (type enter to stop adding): ')
                if (newVal == '') continueAdding = false
                else args.push(newVal)
            }
        } else { // list of lists / maps
            for (let continueAdding = true, i = 0; continueAdding; i++) {
                let add = prompt('Add an item to ' + namespace + '? (y/n) ')
                switch (add.toUpperCase()) {
                    case 'Y':
                    case 'YES':
                        args.push(askForArgs(schema[0], namespace + '[' + i + ']'))
                        break;
                    case 'N':
                    case 'NO':
                        continueAdding = false
                }
            }
        }

        return args
    }

    // map
    let args = {}
    for (let i in schema) {
        let subnamespace = namespace == '' ? i: namespace + '.' + i
        args[i] = askForArgs(schema[i], subnamespace)
    }
    return args
}

// Get the config from given files and handle type lists
function getConfig(src) {
    let config = src
        .map(path => glob.sync(path, { nodir: true })) // get the list of files matching given pattern
        .reduce((a,b) => a.concat(b)) // flatten it to one list
        .map(path => readYaml(path))
        .reduce((a,b) => Object.assign({}, a, b)) // merge the configs

    // case in which the type is a list of items of another type
    for (let typeName in config) {
        if (Array.isArray(config[typeName])) {
            let listItemTypeName = config[typeName][0]
            let listItemType = config[listItemTypeName]

            config[typeName] = {
                arguments: { [typeName]: [listItemType.arguments] },
                list: true,
                originOutputs: listItemType.outputs
            }
        }
    }

    return config
}

function readYaml(filePath) {
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
}

function writeFile(filePath, contents) {
    // create dir if it doesn't already exist
    let dirPath = path.dirname(filePath)
    try { fs.statSync(dirPath) }
    catch(e) { mkdirp.sync(dirPath) }

    fs.writeFileSync(filePath, contents, { flag: 'w+' })
}
