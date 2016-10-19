const yaml = require('js-yaml')

module.exports = {
    flower: str => Array.isArray(str) ? str.map(i => flower(i)): flower(str),
    fupper: str => Array.isArray(str) ? str.map(i => fupper(i)): fupper(str),

    snakecase: str => Array.isArray(str) ? str.map(i => splitVariableName(i).join('_')): splitVariableName(str).join('_'),
    kebabcase: str => Array.isArray(str) ? str.map(i => splitVariableName(i).join('-')): splitVariableName(str).join('-'),
    camelcase: str => Array.isArray(str) ? str.map(i => camelcase(i)): camelcase(str),
    varcamelcase: str => Array.isArray(str) ? str.map(i => flower(camelcase(i))): flower(camelcase(str)),

    prepend: (list, toPrepend) => list.map(str => toPrepend + str),
    append: (list, toAppend) => list.map(str => str + toAppend),
    keys: dict => Object.keys(dict),
    values: dict => { let res = []; for (let i in dict) res.push(dict[i]); return res },

    json: dict => JSON.stringify(dict),
    yaml: dict => yaml.safeDump(dict)
}

function splitVariableName(varName) {
    // snake case
    let split = varName.split('_')
    if (split.length > 1) return split

    // kebab case
    split = varName.split('-')
    if (split.length > 1) return split

    // camel case
    split = varName.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase().split('-')
    return split
}

function camelcase(str) {
    return splitVariableName(str).map(i => fupper(i)).join('')
}

function flower(str) {
    return str.charAt(0).toLowerCase() + str.substr(1)
}

function fupper(str) {
    return str.charAt(0).toUpperCase() + str.substr(1)
}
