#! /usr/bin/env node

const nunjucks = require('nunjucks')
const argv = require('minimist')(process.argv.slice(2))
const chalk = require('chalk')
const path = require('path')
const helpMessage = require('./help')
const argsSanitizer = require('./args')
const interfaceGenerator = require('./interface/interface-generator')
const visualizationGenerator = require('./visualization/visualization-generator')
const nunjucksEnv = require('./renderer')

const generator = require('./generation/generator')(nunjucksEnv)

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

    // add filters
    require('./template/filters')(nunjucksEnv)

    // get the arguments
    let args = argsSanitizer.sanitizeArgs(argv)

    // add filters and globals
    let plugins = ['./template/functions']
    plugins.forEach(i => require(i)(nunjucksEnv, args.model, args.config))
    console.log(chalk.yellow('Loading plugins'))
    args.plugins.forEach(modifier => require(path.resolve(modifier))(nunjucksEnv, args.model, args.config))

    switch (command) {
        case 'generate':
            argsSanitizer.setData(args, argv)
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
            visualizationGenerator.generateVisualization(args.model, args.config, output, nunjucksEnv)
            console.log(chalk.bold.green('Done, without errors'))
    }
}
