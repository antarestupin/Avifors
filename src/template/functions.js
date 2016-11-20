const yaml = require('js-yaml')
const fs = require('fs')
const modelFunctions = require('../model')

module.exports = (nunjucksEnv, model, config) => {
    let functions = {
        _: (cond, joiner='\n') => cond ? joiner: '',
        findInModel: str => modelFunctions.findInModel(str, model, config),
        findOneInModel: str => modelFunctions.findInModel(str, model, config)[0],
        readFile: readFile
    }

    for (let i in functions) nunjucksEnv.addGlobal(i, functions[i])
}

// display the contents of a file
const readFile = path => fs.readFileSync(path, 'utf8')
