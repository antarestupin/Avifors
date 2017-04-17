import yaml from 'js-yaml'

// 'camelCase' => ['camel', 'case']
function splitVariableName(varName) {
  return ['-', '_'].map(i => varName.split(i)).find(i => i.length > 1) // kebab-case / snake_case
    || varName.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase().split('-') // PascalCase / camelCase
}

function scalableOrArrayFunction(fn) {
  return function(...args) {
    if (Array.isArray(args[0])) {
      const head = args.shift()
      return head.map(i => fn(i, ...args))
    }

    return fn(...args)
  }
}

// code conventions
const snakeCase = scalableOrArrayFunction(str => splitVariableName(str).join('_')) // snake_case
const kebabCase = scalableOrArrayFunction(str => splitVariableName(str).join('-')) // kebab-case
const camelCase = scalableOrArrayFunction(str => flower(pascalCase(str))) // camelCase
const pascalCase = scalableOrArrayFunction(str => splitVariableName(str).map(i => fupper(i)).join('')) // PascalCase
const upperCamelCase = str => pascalCase(str)
const lowerCamelCase = str => camelCase(str)

// string manipulation
const flower = scalableOrArrayFunction(str => str.charAt(0).toLowerCase() + str.substr(1)) // LOWER => lOWER
const fupper = scalableOrArrayFunction(str => str.charAt(0).toUpperCase() + str.substr(1)) // upper => Upper
const prepend = scalableOrArrayFunction((str, toPrepend) => toPrepend + str) // prepend('foo', '$') => $foo
const append = scalableOrArrayFunction((str, toAppend) => str + toAppend) // append('foo', '$') => foo$
const surround = scalableOrArrayFunction((str, toAdd) => toAdd + str + toAdd) // surround('foo', '$') => $foo$

// collection manipulation
const keys = dict => Object.keys(dict) // get object keys
const values = dict => Object.values(dict) // get object values
const toArray = (dict, key) => { // toArray({a: {b: 'c'}}, 'id') => [{id: 'a', b: 'c'}]
  let res = []
  for (let i in dict) {
    res.push({
      [key]: i,
      ...dict[i]
    })
  }
  return res
}
const findByColumn = (list, column, value) => list.filter(i => i[column] === value) // filter an object by the value of one of its columns
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

export const filters = {
  snakecase: snakeCase,
  kebabcase: kebabCase,
  pascalcase: pascalCase,
  camelcase: camelCase,
  uppercamelcase: upperCamelCase,
  lowercamelcase: lowerCamelCase,

  flower: flower,
  fupper: fupper,
  prepend: prepend,
  append: append,
  surround: surround,

  keys: keys,
  values: values,
  toArray: toArray,
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
