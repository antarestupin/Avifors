module.exports = {
    env: "prod",

    fs: require('fs'),

    mkdirp: require('mkdirp'),

    nunjucksEnv: require('nunjucks').configure({
        autoescape: false,
        trimBlocks: true,
        lstripBlocks: true
    }),

    path: require('path'),

    prompt: require('prompt-sync')({ sigint: true })
}
