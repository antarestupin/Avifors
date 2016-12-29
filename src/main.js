#! /usr/bin/env node

const nunjucks = require('nunjucks')
const argv = require('minimist')(process.argv.slice(2))
const chalk = require('chalk')
const helpMessage = require('./help/help')
const argsSanitizer = require('./common/args')
const interfaceGenerator = require('./interface/interface-generator')
const visualizationGenerator = require('./visualization/visualization-generator')
const globalContainer = require('./common/container')
const data = require('./generation/data')
const generator = require('./generation/generator')

try {
    main(argv)
}
catch (e) {
    console.log('\n' + chalk.red(chalk.bold.underline('Error') + ':\n\n' + e))
    console.log('\nType ' + chalk.cyan('avifors -h') + ' for more help')
    console.log('\n' + chalk.red('Generation aborted due to error\n'))
}

function main(argv) {
    // get the command
    argsSanitizer.setCommand(argv)
    const command = argv._[0]

    // helper message (must be executed first because errors can be thrown later)
    if ('h' in argv || 'help' in argv || command == 'help') {
        console.log(helpMessage)
        return
    }

    const nunjucksEnv = globalContainer.get('nunjucksEnv')
    const path = globalContainer.get('path')

    // add filters
    require('./template/add-filters')(nunjucksEnv)

    // get the arguments
    let args = argsSanitizer.sanitizeArgs(argv)

    // add filters and globals
    let plugins = ['./template/add-functions']
    plugins.forEach(i => require(i)(nunjucksEnv, args.model, args.config))
    console.log(chalk.yellow('Loading plugins'))
    args.plugins.forEach(modifier => require(path.resolve(modifier))(nunjucksEnv, args.model, args.config))

    switch (command) {
        case 'generate':
            data.setData(args, argv)
            console.log(chalk.yellow('Starting code generation'))
            generator.generate(args.config, args.data, args.model, args.global)
            console.log(chalk.bold.green('Done, without errors'))
            break

        case 'interface':
            console.log(chalk.yellow('Generating the interface'))
            if (argv._[1]) {
                interfaceGenerator.printInterfaceItem(args.config, 'entity')
            } else if (argv.output && !argv.console) {
                interfaceGenerator.generateInterface(args.config, argv.output)
            } else {
                interfaceGenerator.printInterface(args.config)
            }
            break

        case 'visualize':
            console.log(chalk.yellow('Generating the visualization'))
            let output = argv._[1] || argv['v-output'] || 'model.html'
            visualizationGenerator.generateVisualization(args.model, args.config, argv['visualization-src'], output)
            console.log(chalk.bold.green('Done, without errors'))
    }
}
