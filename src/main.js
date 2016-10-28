#! /usr/bin/env node

const nunjucks = require('nunjucks')
const argv = require('minimist')(process.argv.slice(2))
const filtersBuilder = require('./filters')
const chalk = require('chalk')
const helpMessage = require('./help')
const argsSanitizer = require('./args')

const nunjucksEnv = nunjucks.configure({
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
})

const generator = require('./generator')(nunjucksEnv)

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
    let args = argsSanitizer.sanitizeArgs(argv)
    let filters = filtersBuilder(args.model, args.config)
    for (i in filters) nunjucksEnv.addFilter(i, filters[i])
    generator.generate(args)
}
