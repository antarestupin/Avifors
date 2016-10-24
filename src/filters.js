const yaml = require('js-yaml')
const fs = require('fs')

module.exports = (model, config) => {
    return {
        flower: str => Array.isArray(str) ? str.map(i => flower(i)): flower(str),
        fupper: str => Array.isArray(str) ? str.map(i => fupper(i)): fupper(str),

        snakecase: str => Array.isArray(str) ? str.map(i => splitVariableName(i).join('_')): splitVariableName(str).join('_'),
        kebabcase: str => Array.isArray(str) ? str.map(i => splitVariableName(i).join('-')): splitVariableName(str).join('-'),
        pascalcase: str => Array.isArray(str) ? str.map(i => pascalcase(i)): pascalcase(str),
        camelcase: str => Array.isArray(str) ? str.map(i => flower(pascalcase(i))): flower(pascalcase(str)),
        uppercamelcase: str => Array.isArray(str) ? str.map(i => pascalcase(i)): pascalcase(str),
        lowercamelcase: str => Array.isArray(str) ? str.map(i => flower(pascalcase(i))): flower(pascalcase(str)),

        prepend: (list, toPrepend) => list.map(str => toPrepend + str),
        append: (list, toAppend) => list.map(str => str + toAppend),
        keys: dict => Object.keys(dict),
        values: dict => { let res = []; for (let i in dict) res.push(dict[i]); return res },

        json: dict => JSON.stringify(dict),
        yaml: dict => yaml.safeDump(dict),

        findinmodel: str => findInModel(str, model, config),
        findoneinmodel: str => findInModel(str, model, config)[0],

        readfile: path => fs.readFileSync(path, 'utf8')
    }
}

function splitVariableName(varName) {
    // snake_case
    let split = varName.split('_')
    if (split.length > 1) return split

    // kebab-case
    split = varName.split('-')
    if (split.length > 1) return split

    // camelCase / PascalCase
    split = varName.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase().split('-')
    return split
}

function pascalcase(str) {
    return splitVariableName(str).map(i => fupper(i)).join('')
}

function flower(str) {
    return str.charAt(0).toLowerCase() + str.substr(1)
}

function fupper(str) {
    return str.charAt(0).toUpperCase() + str.substr(1)
}

// entity{name: user}
function findInModel(request, model, config) {
    let sepatatorIndex = request.indexOf('{')
    let itemType = request.substr(0, sepatatorIndex)
    let itemFilters = yaml.safeLoad(request.substr(sepatatorIndex))
    let result = model.filter(i => i.type == itemType).map(i => i.arguments)
    let itemListType = null

    for (let i in config) {
        if (config[i].list && config[i].origin == itemType) {
            result = result.concat(model.filter(j => j.type == i).map(j => j.arguments[i])[0])
        }
    }

    function filterItems(modelSubTree, filters) {
        let res = true
        for (let i in filters) {
            let subTree = modelSubTree
            i.split('.').forEach(j => subTree = subTree[j])

            if (typeof subTree == 'string') res = res && subTree == filters[i]
            else res = res && filterItems(subTree, filters[i])
        }
        return res
    }

    return result.filter(item => filterItems(item, itemFilters))
}
