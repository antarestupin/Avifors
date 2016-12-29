const chalk = require('chalk')
const helpers = require('./helpers')
const defaults = require('./defaults')
const exceptions = require('./exceptions')
const globalContainer = require('./container')

module.exports = {
    askForArgs: askForArgs,
    getImplArguments: getImplArguments,
    flattenModel: flattenModel
}

// flatten the item lists in the model
function flattenModel(model, config) {
    return model
        .map(item => {
            return config[item.type].list ?
                item.arguments[item.type].map(i => {
                    return {
                        type: config[item.type].origin,
                        arguments: i
                    }
                }):
                item
        })
        .reduce((a,b) => a.concat(b))
}

// get implementation specific arguments
function getImplArguments(impl, args, type) {
    return impl
        .map((i, index) => {
            let pathTemplate = i.path || i,
                optional = i.optional !== undefined && i.optional,
                path

            try { path = container.get('nunjucksEnv').renderString(pathTemplate, args) }
            catch (e) { throw exceptions.nunjucksRenderOption(`impl_arguments[${index}]`, type, e) }

            try { return helpers.readYaml(path) }
            catch (e) {
                if (optional) return {}
                else throw e
            }
        })
        .reduce((a,b) => Object.assign({}, a, b)) // the latter overrides the former
}

// Ask for the item arguments to the user
function askForArgs(schema, namespace = '', container = globalContainer) {
    const prompt = container.get('prompt')

    let type = helpers.getArgType(schema)
    let schemaContents = schema._contents || schema

    // string
    if (['string', 'number', 'boolean'].indexOf(type) !== -1) {
        let defaultValue = schema._default || defaults.getDefaultValue(type)
        let defaultSection = defaultValue === '' ? '': ` (${defaultValue})`

        let enteredValue = prompt('Value of ' + chalk.cyan(namespace + defaultSection) + ': ')

        if (enteredValue === '') enteredValue = defaultValue

        return enteredValue
    }

    // list
    if (type == 'list') {
        let args = []

        if (helpers.isScalar(schemaContents[0])) { // list of scalars
            for (let continueAdding = true; continueAdding;) {
                let newVal = prompt('Add a value to ' + chalk.cyan(namespace) + ' (type enter to stop adding): ')
                if (newVal == '') continueAdding = false
                else args.push(newVal)
            }
        } else { // list of lists / maps
            for (let continueAdding = true, i = 0; continueAdding; i++) {
                let add = prompt('Add an item to ' + chalk.cyan(namespace) + '? (Y/n) ')
                switch (add.toUpperCase()) {
                    case 'N':
                    case 'NO':
                        continueAdding = false
                        break
                    case 'Y':
                    case 'YES':
                    default:
                        args.push(askForArgs(schemaContents[0], namespace + '[' + i + ']'))
                }
            }
        }

        return args
    }

    // map
    let args = {}
    for (let i in schemaContents) {
        if (i.charAt(0) !== '_') {
            let subnamespace = namespace == '' ? i: namespace + '.' + i
            args[i] = askForArgs(schemaContents[i], subnamespace)
        }
    }

    return args
}
