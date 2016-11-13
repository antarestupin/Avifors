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

    if (argType == 'list') {
        if (Array.isArray(arg)) {
            return arg.map(item => getWithDefaultArguments(item, configContents[0]))
        }

        let res = []
        for (let i in arg) {
            let row = {}

            if (!!configContents[0]._value) row[configContents[0]._value] = arg[i]
            else row = arg[i]

            if (!!configContents[0]._key) row[configContents[0]._key] = i

            res.push(getWithDefaultArguments(row, configContents[0]))
        }
        return res
    }

    if (argType == 'map') {
        for (let i in configArgs) {
            arg[i] = getWithDefaultArguments(arg[i], configArgs[i])
        }
    }

    return arg
}
