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
    generate(args.config, args.toGenerate)
}

function sanitizeArgs(argv) {
    let source = 'cli'
    if (!!argv['data-src']) source = 'file'
    else if (!!argv['type'] && !!argv['args']) source = 'arguments'

    let result = {
        config: readYaml(argv['config-src'] || '.avifors.yaml'),
        source: source
    }

    switch (source) {
        case 'cli':
            let type = argv['type'] || getType()
            result.toGenerate = [{
                type: type,
                arguments: getArgs(result.config[type].arguments)
            }]
            break
        case 'file':
            result.toGenerate = readYaml(argv['data-src'])
            break
        case 'arguments':
            result.toGenerate = [{
                type: argv['type'],
                arguments: JSON.parse(argv['args'])
            }]
    }

    return result
}

function generate(config, toGenerate) {
    toGenerate.forEach(item => {
        config[item.type].outputs.forEach(output => {
            let templatePath = nunjucksEnv.renderString(output.template, item.arguments)
            let outputPath = nunjucksEnv.renderString(output.output, item.arguments)
item.arguments['test'] = {bla: 'ok', foo: 'ijij'}
            let rendered = renderTemplate(templatePath, item.arguments)

            writeFile(outputPath, rendered)
            console.log(rendered)
        })
    })
}

function getType() {
    return prompt('Type of the item to generate? ')
}

function getArgs(schema, namespace = '') {
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
                let add = prompt('Add a value to ' + namespace + '? (y/n) ')
                switch (add.toUpperCase()) {
                    case 'Y':
                    case 'YES':
                        args.push(getArgs(schema[0], namespace + '[' + i + ']'))
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
        args[i] = getArgs(schema[i], subnamespace)
    }
    return args
}

function readYaml(filePath) {
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
}

function renderTemplate(templatePath, args) {
    return nunjucksEnv.render(templatePath, args)
}

function writeFile(filePath, contents) {
    // create dir if it doesn't already exist
    let dirPath = path.dirname(filePath)
    try { fs.statSync(dirPath) }
    catch(e) { mkdirp.sync(dirPath) }

    fs.writeFileSync(filePath, contents, { flag: 'w+' })
}
