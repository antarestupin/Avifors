#! /usr/bin/env node

const nunjucks = require('nunjucks')
const argv = require('minimist')(process.argv.slice(2))
const chalk = require('chalk')
const path = require('path')
const helpMessage = require('./help')
const argsSanitizer = require('./args')

const nunjucksEnv = nunjucks.configure({
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
})

const generator = require('./generator')(nunjucksEnv)

argsSanitizer.setCommand(argv)
const command = argv._[0]

if ('h' in argv || 'help' in argv || command == 'help') {
    console.log(helpMessage)
} else {
    try {
        main(argv)
    }
    catch (e) {
        console.log('\n' + chalk.red(chalk.bold.underline('Error') + ':\n\n' + e))
        console.log('\nType ' + chalk.cyan('avifors -h') + ' for more help')
        console.log('\n' + chalk.red('Generation aborted due to error\n'))
    }
}

function main(argv) {
    let args = argsSanitizer.sanitizeArgs(argv)

    // add filters and globals
    console.log(chalk.yellow('Loading plugins'))
    let plugins = ['./template/filters', './template/functions']
    plugins.forEach(i => require(i)(nunjucksEnv, args.model, args.config))
    args.plugins.forEach(modifier => require(path.resolve(modifier))(nunjucksEnv, args.model, args.config))

    switch (command) {
        case 'generate':
            console.log(chalk.yellow('Starting code generation'))
            generator.generate(args.config, args.data, args.model, args.global)
            console.log(chalk.bold.green('Done, without errors'))
    }
}
