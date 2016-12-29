const yaml = require('js-yaml')
const globalContainer = require('./container')
const exceptions = require('./exceptions')

module.exports = {
    getArgType: getArgType,
    readYaml: readYaml,
    writeFile: writeFile,
    isScalar: isScalar,
    fileExists: fileExists,
    findListItemName: findListItemName,
    getType: getType,
    getUserDefinedProperties: getUserDefinedProperties
}

function getType(value) {
    if (isScalar(value)) {
        return 'scalar'
    }

    if (Array.isArray(value)) {
        return 'list'
    }

    if (value === undefined || value === null) {
        return 'null'
    }

    return 'map'
}

// find the name of the list item name for given item
function findListItemName(itemName, config) {
    for (let i in config) {
        if (config[i].list && config[i].origin == itemName) {
            return i
        }
    }

    return null
}

// say if a file exists
function fileExists(filePath, container = globalContainer) {
    try {
        container.get('fs').readFileSync(filePath, 'utf8')
        return true
    } catch (e) {
        return false
    }
}

// say wether a val is scalar or not
function isScalar(val) {
    return (/string|number|boolean/).test(typeof val)
}

function getUserDefinedProperties(model) {
    let res = {}

    for (let i in model) {
        if (i.charAt(0) !== '_') {
            res[i] = model[i]
        }
    }

    return res
}

// get the type of a model argument
function getArgType(schema) {
    let contents = schema._contents || schema

    if (isScalar(contents)) return contents.toLowerCase()

    if (Array.isArray(contents)) return 'list'

    return 'map'
}

// read and parse a yaml file
function readYaml(filePath, container = globalContainer) {
    try {
        return yaml.safeLoad(container.get('fs').readFileSync(filePath, 'utf8'))
    } catch (e) {
        if (e instanceof yaml.YAMLException) throw exceptions.yamlLoadFile(filePath, e)
        else throw exceptions.readFile(filePath)
    }
}

// write contents to a file and create its parent dir if it doesn't already exist
function writeFile(filePath, contents, container = globalContainer) {
    const fs = container.get('fs')

    try {
        let dirPath = container.get('path').dirname(filePath)
        try { fs.statSync(dirPath) }
        catch(e) { container.get('mkdirp').sync(dirPath) }

        fs.writeFileSync(filePath, contents, { flag: 'w+' })
    } catch (e) {
        throw exceptions.writeFile(filePath)
    }
}
