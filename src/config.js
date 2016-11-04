const glob = require('glob')
const exceptions = require('./exceptions')
const helpers = require('./helpers')

module.exports = {
    getConfig: getConfig
}

// Get the config from given files and handle type lists
function getConfig(src) {
    if (!src) throw exceptions.noConfig()

    let config = src
        .map(path => glob.sync(path, { nodir: true })) // get the list of files matching given pattern
        .reduce((a,b) => a.concat(b)) // flatten it to one list
        .map(path => helpers.readYaml(path))
        .reduce((a,b) => Object.assign({}, a, b)) // merge the configs

    // case in which the type is a list of items of another type
    for (let typeName in config) {
        if (Array.isArray(config[typeName])) {
            let listItemTypeName = config[typeName][0]
            let listItemType = config[listItemTypeName]

            config[typeName] = {
                arguments: { [typeName]: [listItemType.arguments] },
                list: true,
                origin: listItemTypeName
            }
        }
    }

    return config
}
