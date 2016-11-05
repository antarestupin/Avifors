const glob = require('glob')
const exceptions = require('./exceptions')
const helpers = require('./helpers')

module.exports = {
    getConfig: getConfig
}

// Get the config from given files
function getConfig(src) {
    if (!src) throw exceptions.noConfig()

    let config = src
        .map(path => glob.sync(path, { nodir: true })) // get the list of files matching given pattern
        .reduce((a,b) => a.concat(b)) // flatten it to one list
        .map(path => helpers.readYaml(path))
        .reduce((a,b) => Object.assign({}, a, b)) // merge the configs

    resolveLists(config)

    setDefaultType(config)

    resolveInheritance(config)

    return config
}

// handle the case in which an item is a list of items of another type
function resolveLists(config) {
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
}

// set default type for model items
function setDefaultType(config) {
    for (let i in config) {
        if (!config[i]._type) {
            config[i]._type = 'model_item'
        }
    }
}

// include arguments' parents contents
function resolveInheritance(config) {
    function resolveArgInheritance(arg) {
        let parentArg = !!arg._extends ? resolveArgInheritance(config[arg._extends]): {}

        return Object.assign({}, parentArg, arg._contents)
    }

    function resolveArgsInheritance(args) {
        if (typeof args == 'string') return
        if (Array.isArray(args)) return resolveArgsInheritance(args[0])

        if (!!args._extends) {
            let parentArg = resolveArgInheritance(config[args._extends])
            Object.assign(args, parentArg, args._contents)
            delete args._extends
            delete args._contents
        }

        for (let i in args) {
            if (i.charAt(0) !== '_' && i !== '_contents') {
                resolveArgsInheritance(args[i])
            }
        }
    }

    for (let i in config) {
        if (config[i]._type == 'model_item') {
            resolveArgsInheritance(config[i].arguments)
        }
    }
}
