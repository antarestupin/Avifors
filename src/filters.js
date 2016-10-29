const yaml = require('js-yaml')
const fs = require('fs')

module.exports = (model, config) => {
    return {
        flower: flower,
        fupper: flower,

        snakecase: snakeCase,
        kebabcase: kebabCase,
        pascalcase: pascalCase,
        camelcase: camelCase,
        uppercamelcase: upperCamelCase,
        lowercamelcase: lowerCamelCase,

        prepend: prepend,
        append: append,
        keys: keys,
        values: values,
        findByColumn: findByColumn,
        findOneByColumn: findOneByColumn,
        map: map,
        filter: filter,

        json: jsonDump,
        yaml: yamlDump,

        findinmodel: str => findInModel(str, model, config),
        findoneinmodel: findOneInModel,

        readfile: readFile,

        apply: apply
    }
}

function splitVariableName(varName) {
    return ['-', '_'].map(i => varName.split(i)).find(i => i.length > 1) // kebab-case / snake_case
        || varName.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase().split('-') // PascalCase / camelCase
}

const snakeCase = str => Array.isArray(str) ? str.map(i => snakeCase(i)): splitVariableName(str).join('_')
const kebabCase = str => Array.isArray(str) ? str.map(i => kebabCase(i)): splitVariableName(str).join('-')
const camelCase = str => Array.isArray(str) ? str.map(i => camelCase(i)): flower(pascalCase(str))
const pascalCase = str => Array.isArray(str) ? str.map(i => pascalCase(i)): splitVariableName(str).map(i => fupper(i)).join('')
const upperCamelCase = str => pascalCase(str)
const lowerCamelCase = str => camelCase(str)

const flower = str => Array.isArray(str) ? str.map(i => flower(i)): str.charAt(0).toLowerCase() + str.substr(1)
const fupper = str => Array.isArray(str) ? str.map(i => fupper(i)): str.charAt(0).toUpperCase() + str.substr(1)

const prepend = (list, toPrepend) => list.map(str => toPrepend + str)
const append = (list, toAppend) => list.map(str => str + toAppend)
const keys = dict => Object.keys(dict)
const values = dict => { let res = []; for (let i in dict) res.push(dict[i]); return res }
const findByColumn = (list, column, value) => list.filter(i => i[column] == value)
const findOneByColumn = (list, column, value) => list.filter(i => i[column] == value)[0]
const map = (collection, fn) => collection.map(eval(fn))
const filter = (collection, fn) => collection.filter(eval(fn))

const jsonDump = dict => JSON.stringify(dict)
const yamlDump = dict => yaml.safeDump(dict)

const findOneInModel = str => findInModel(str, model, config)[0]

const readFile = path => fs.readFileSync(path, 'utf8')

const apply = (val, fn) => eval(fn)(val)

// entity{name: user}
function findInModel(request, model, config) {
    let sepatatorIndex = request.indexOf('{')
    let itemType = request.substr(0, sepatatorIndex)
    let itemFilters = yaml.safeLoad(request.substr(sepatatorIndex))
    let result = model.filter(i => i.type == itemType).map(i => i.arguments)

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
