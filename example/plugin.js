module.exports = (nunjucksEnv, model, config) => {
    nunjucksEnv.addFilter('foo', str => 'foo')
}
