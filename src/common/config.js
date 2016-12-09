const glob = require('glob')
const exceptions = require('./exceptions')
const helpers = require('./helpers')
const container = require('./container')

module.exports = {
    getConfig: getConfig,
    _resolveItem: resolveItem,
    _resolveMeta: resolveMeta,
    _resolveLists: resolveLists,
    _setDefaultType: setDefaultType,
    _resolveInheritance: resolveInheritance
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

    //resolveInheritance(config)

    for (let i in config) {
        config[i].arguments = resolveItem(config[i].arguments)

        config[i].arguments = resolveMeta(config[i].arguments)
    }

    return config
}

function resolveItem(item) {
    const nunjucksEnv = container.get('nunjucksEnv')

    switch (helpers.getType(item)) {
        case 'list':
            item[0] = resolveItem(item[0])
            break

        case 'map':
            if (!!item._include) {
                if (!Array.isArray(item._include)) {
                    item._include = [item._include]
                }

                let toInclude = item._include
                    .map(i => nunjucksEnv.renderString(i, { include: path => helpers.readYaml(path) }))
                    .map(i => JSON.parse(i))
                    .map(i => resolveItem(i))
                    .reduce((a,b) => Object.assign({}, a, b))

                item = Object.assign({}, toInclude, item)

                delete item._include
            }

            for (let i in helpers.getUserDefinedProperties(item)) {
                item[i] = resolveItem(item[i])
            }
    }

    return item
}

function resolveMeta(config) {
    if (config === undefined) return

    if (typeof config == 'string') return config

    if (Array.isArray(config)) return config.map(i => resolveMeta(i))

    let specialKeys = ['_key', '_value']
    specialKeys.forEach(i => {
        if (!!config[i]) config[config[i]] = 'string'
    })

    for (let i in helpers.getUserDefinedProperties(config)) {
        config[i] = resolveMeta(config[i])
    }

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
