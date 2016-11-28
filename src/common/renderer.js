const nunjucks = require('nunjucks')

const nunjucksEnv = nunjucks.configure({
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
})

module.exports = nunjucksEnv
