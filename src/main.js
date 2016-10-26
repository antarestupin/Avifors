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
const chalk = require('chalk')
const helpMessage = require('./help')
const exceptions = require('./exceptions')

const nunjucksEnv = nunjucks.configure({
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
})

nunjucksEnv.addGlobal('_', (cond, joiner='\n') => cond ? joiner: '')

if ('h' in argv || 'help' in argv) {
    console.log(helpMessage)
} else {
    try {
        main(argv)
        console.log(chalk.bold.green('Done, without errors'))
    }
    catch (e) {
        console.log('\n' + chalk.red(chalk.bold.underline('Error') + ':\n\n' + e))
        console.log('\nType ' + chalk.cyan('avifors -h') + ' for more help')
        console.log('\n' + chalk.red('Generation aborted due to error\n'))
    }
}

function main(argv) {
    let args = sanitizeArgs(argv)
    let filters = filtersBuilder(args.model, args.config)
    for (i in filters) nunjucksEnv.addFilter(i, filters[i])
    generate(args)
}

// Get the arguments needed
function sanitizeArgs(argv) {
    // get the avifors config file if it exists
    if (!!argv['avifors-src']) Object.assign(argv, readYaml(argv['avifors-src']))
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
        config: getConfig(argv['config-src']),
        source: source,
        global: argv.global || {}
    }

    result.model = (!argv['model-src']) ? []: (argv['model-src'])
        .map(src => glob.sync(src, { nodir: true })) // get the list of files matching given pattern
        .reduce((a,b) => a.concat(b)) // flatten it to one list
        .map(src => readYaml(src))
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
                args = askForArgs(result.config[type].arguments)
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

// Generate the code
function generate({config: config, data: data, model: model, global: globalVar}) {
    data.forEach(item => {
        // case in which the type is a list of items of another type
        if (config[item.type].list) {
            config[item.type].outputs = []
            item.arguments[item.type].forEach(argItem => {
                config[item.type].originOutputs.forEach((output, outputIndex) => {
                    let templateValue, outputValue

                    try { templateValue = nunjucksEnv.renderString(output.template, argItem) }
                    catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].template`, item.type, e) }

                    try { outputValue = nunjucksEnv.renderString(output.output, argItem) }
                    catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].output`, item.type, e) }

                    config[item.type].outputs.push({
                        template: templateValue,
                        arguments: argItem,
                        output: outputValue
                    })
                })
            })
        }

        // compute the outputs defined by a template
        if (typeof config[item.type].outputs == 'string') {
            try {
                config[item.type].outputs = yaml.safeLoad(nunjucksEnv.renderString(config[item.type].outputs, item.arguments))
            } catch (e) {
                if (e instanceof yaml.YAMLException) throw exceptions.yamlLoadConfigOutputs(item.type, e)
                else throw exceptions.nunjucksRenderOption('outputs', item.type, e)
            }
        }

        config[item.type].outputs.forEach((output, outputIndex) => {
            // every argument is passed by default
            if (!output.arguments) output.arguments = item.arguments

            // add global variables
            output.arguments._args = item.arguments // useful for list items
            output.arguments._model = model
            output.arguments._global = globalVar // global variables defined in the .avifors.yaml file

            // get template and output paths
            let templatePath, outputPath

            try { templatePath = nunjucksEnv.renderString(output.template, item.arguments) }
            catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].template`, item.type, e) }

            try { outputPath = nunjucksEnv.renderString(output.output, output.arguments) }
            catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].output`, item.type, e) }

            let rendered
            try { rendered = nunjucksEnv.render(templatePath, output.arguments) }
            catch (e) { throw exceptions.nunjucksRenderTemplate(templatePath, e) }

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
                let add = prompt('Add an item to ' + namespace + '? (Y/n) ')
                switch (add.toUpperCase()) {
                    case 'N':
                    case 'NO':
                        continueAdding = false
                        break;
                    case 'Y':
                    case 'YES':
                    default:
                        args.push(askForArgs(schema[0], namespace + '[' + i + ']'))
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
    if (!src) throw exceptions.noConfig()

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
                origin: listItemTypeName,
                originOutputs: listItemType.outputs
            }
        }
    }

    return config
}

function readYaml(filePath) {
    try {
        return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
        if (e instanceof yaml.YAMLException) throw exceptions.yamlLoadFile(filePath, e)
        else throw exceptions.readFile(filePath)
    }
}

function writeFile(filePath, contents) {
    try {
        // create dir if it doesn't already exist
        let dirPath = path.dirname(filePath)
        try { fs.statSync(dirPath) }
        catch(e) { mkdirp.sync(dirPath) }

        fs.writeFileSync(filePath, contents, { flag: 'w+' })
    } catch (e) {
        throw exceptions.writeFile(filePath)
    }
}
