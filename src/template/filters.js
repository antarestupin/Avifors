const yaml = require('js-yaml')

// 'camelCase' => ['camel', 'case']
function splitVariableName(varName) {
    return ['-', '_'].map(i => varName.split(i)).find(i => i.length > 1) // kebab-case / snake_case
        || varName.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase().split('-') // PascalCase / camelCase
}

// code conventions
const snakeCase = str => Array.isArray(str) ? str.map(i => snakeCase(i)): splitVariableName(str).join('_') // snake_case
const kebabCase = str => Array.isArray(str) ? str.map(i => kebabCase(i)): splitVariableName(str).join('-') // kebab-case
const camelCase = str => Array.isArray(str) ? str.map(i => camelCase(i)): flower(pascalCase(str)) // camelCase
const pascalCase = str => Array.isArray(str) ? str.map(i => pascalCase(i)): splitVariableName(str).map(i => fupper(i)).join('') // PascalCase
const upperCamelCase = str => pascalCase(str)
const lowerCamelCase = str => camelCase(str)

// string manipulation
const flower = str => Array.isArray(str) ? str.map(i => flower(i)): str.charAt(0).toLowerCase() + str.substr(1) // LOWER => lOWER
const fupper = str => Array.isArray(str) ? str.map(i => fupper(i)): str.charAt(0).toUpperCase() + str.substr(1) // upper => Upper
const prepend = (str, toPrepend) => Array.isArray(str) ? str.map(i => prepend(i, toPrepend)): toPrepend + str // prepend('foo', '$') => $foo
const append = (str, toAppend) => Array.isArray(str) ? str.map(i => append(i, toAppend)): str + toAppend // append('foo', '$') => foo$
const surround = (str, toAdd) => Array.isArray(str) ? str.map(i => surround(i, toAdd)): toAdd + str + toAdd // surround('foo', '$') => $foo$

// collection manipulation
const keys = dict => Object.keys(dict) // get object keys
const values = dict => { let res = []; for (let i in dict) res.push(dict[i]); return res } // get object values
const findByColumn = (list, column, value) => list.filter(i => i[column] == value) // filter an object by the value of one of its columns
const findOneByColumn = (list, column, value) => findByColumn(list, column, value)[0]
const map = (collection, fn) => collection.map(eval(fn)) // apply a map to the collection with a JS function
const filter = (collection, fn) => collection.filter(eval(fn)) // apply a filter to the collection with a JS function

// data format
const jsonParse = str => JSON.parse(str)
const jsonDump = dict => JSON.stringify(dict)
const yamlParse = str => yaml.safeLoad(str)
const yamlDump = dict => yaml.safeDump(dict, { indent: 4 })

// other
const apply = (val, fn) => eval(fn)(val) // apply a JS function to the given value

module.exports = {
    flower: flower,
    fupper: fupper,

    snakecase: snakeCase,
    kebabcase: kebabCase,
    pascalcase: pascalCase,
    camelcase: camelCase,
    uppercamelcase: upperCamelCase,
    lowercamelcase: lowerCamelCase,

    prepend: prepend,
    append: append,
    surround: surround,
    keys: keys,
    values: values,
    findbycolumn: findByColumn,
    findonebycolumn: findOneByColumn,
    map: map,
    filter: filter,

    json: jsonDump,
    jsonparse: jsonParse,
    yaml: yamlDump,
    yamlparse: yamlParse,

    apply: apply
}
