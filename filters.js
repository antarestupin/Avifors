const yaml = require('js-yaml')

module.exports = model => {
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
        yaml: dict => yaml.safeDump(dict)/*,

        findinmodel: str => findInModel(str, model),
        findoneinmodel: str => findInModel(str, model)[0]*/
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

// entities:{entities:{name:user}}
function findInModel(str, model) {
    return model.filter()
}
