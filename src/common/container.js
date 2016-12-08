const container = {
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

module.exports = {
    get: id => container[id],
    set: (id, value) => container[id] = value,
    dump: () => container
}
