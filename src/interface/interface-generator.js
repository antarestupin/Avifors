const yaml = require('js-yaml')
const chalk = require('chalk')
const path = require('path')
const helpers = require('../helpers')

module.exports = {
    getInterface: getInterface,
    generateInterface: generateInterface,
    printInterface: printInterface,
    printInterfaceItem: printInterfaceItem
}

// get the model interface
function getInterface(config) {
    let modelInterface = {}

    for (let i in config) {
        if (config[i]._type == 'model_item') {
            if (config[i].list) {
                modelInterface[i] = [config[i].origin]
            } else {
                modelInterface[i] = {
                    arguments: config[i].arguments,
                    impl_arguments: config[i].impl_arguments || []
                }
            }
        }
    }

    return modelInterface
}

// create files containing the model interface
function generateInterface(config, output) {
    let modelInterface = getInterface(config)

    for (let i in modelInterface) {
        helpers.writeFile(
            path.join(output, i + '.yaml'),
            yaml.safeDump({ [i]: modelInterface[i] })
        )
    }
}

// print the model interface
function printInterface(config) {
    let modelInterface = getInterface(config)

    console.log(
        ('\n' + yaml.safeDump(modelInterface))
            .replace(/\n(\w+):/g, '\n' + chalk.magenta('$1'))
            .replace(/(\w+):/g, chalk.cyan('$1') + ':')
    )
}

// print an item of the model interface
function printInterfaceItem(config, itemName) {
    let modelInterface = getInterface(config)

    console.log(
        ('\n' + yaml.safeDump(modelInterface[itemName]))
            .replace(/(\w+):/g, chalk.cyan('$1') + ':')
    )
}
