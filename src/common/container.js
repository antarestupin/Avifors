const nunjucksEnv = require('nunjucks').configure({
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
})

const prompt = require('prompt-sync')({ sigint: true })

const fs = require('fs')

const path = require('path')

const mkdirp = require('mkdirp')

module.exports = {
    env: "prod",
    fs: fs,
    mkdirp: mkdirp,
    nunjucksEnv: nunjucksEnv,
    path: path,
    prompt: prompt
}
