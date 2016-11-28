const filters = require('./filters')

module.exports = (nunjucksEnv, model, config) => {
    for (let i in filters) {
        nunjucksEnv.addFilter(i, filters[i])
    }
}
