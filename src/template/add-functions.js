const functions = require('./functions')
const modelFunctions = require('../common/model')

module.exports = (nunjucksEnv, model, config) => {
    let contextFunctions = {
        findInModel: str => modelFunctions.findInModel(str, model, config),
        findOneInModel: str => modelFunctions.findInModel(str, model, config)[0]
    },
        functionsToAdd = Object.assign({}, functions, contextFunctions)

    for (let i in functionsToAdd) {
        nunjucksEnv.addGlobal(i, functionsToAdd[i])
    }
}
