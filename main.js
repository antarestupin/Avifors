#! /usr/bin/env node

const nunjucks = require('nunjucks')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const prompt = require('prompt-sync')()
const mkdirp = require('mkdirp')
const filters = require('./filters')

const nunjucksEnv = nunjucks.configure({ autoescape: false })
for (i in filters) nunjucksEnv.addFilter(i, filters[i])
main(sanitizeArgs(argv))

function main(args) {
    generate(args.config, args.data)
}

function sanitizeArgs(argv) {
    let source = 'cli'
    if (!!argv['data-src']) source = 'file'
    else if (!!argv['type'] && !!argv['args']) source = 'arguments'

    let result = {
        config: getConfig(argv['config-src'] || '.avifors.yaml'),
        source: source
    }

    switch (source) {
        case 'cli':
            let type = argv['type'] || prompt('Type of the item to generate: ')
            result.data = [{
                type: type,
                arguments: askForArgs(result.config[type].arguments)
            }]
            break
        case 'file':
            result.data = readYaml(argv['data-src'])
            break
        case 'arguments':
            result.data = [{
                type: argv['type'],
                arguments: JSON.parse(argv['args'])
            }]
    }

    return result
}

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
            config[item.type].outputs = yaml.safeLoad(nunjucksEnv.renderString(config[item.type].outputs, item.arguments))
        }

        config[item.type].outputs.forEach(output => {
            // every arguments are passed by default
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

function getConfig(src) {
    let config = readYaml(src)

    for (let typeName in config) {
        // case in which the type is a list of items of another type
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
