const helpers = require('./helpers')

module.exports = {
    getDefaultValue: getDefaultValue,
    getWithDefaultArguments: getWithDefaultArguments
}

// get the default value for given type
function getDefaultValue(type) {
    return {
        'string': '',
        'number': 0,
        'boolean': false,
        'list': [],
        'map': {}
    }[type]
}

// get the arguments with default values for those not provided
function getWithDefaultArguments(arg, configArgs) {
    let argType = helpers.getArgType(configArgs)

    if (arg === undefined) {
        if (!!configArgs._default) arg = configArgs._default
        else arg = getDefaultValue(argType)
    }

    let configContents = !!configArgs._contents ? configArgs._contents: configArgs

    if (argType == 'list') return arg.map(item => getWithDefaultArguments(item, configContents[0]))

    if (argType == 'map') {
        for (let i in configArgs) arg[i] = getWithDefaultArguments(arg[i], configArgs[i])
    }

    return arg
}
