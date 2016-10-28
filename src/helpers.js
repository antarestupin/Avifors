const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const exceptions = require('./exceptions')

module.exports = {
    getArgType: getArgType,
    readYaml: readYaml,
    writeFile: writeFile,
    isScalar: isScalar
}

function isScalar(val) {
    return (/string|number|boolean/).test(typeof val)
}

function getArgType(schema) {
    let contents = schema._contents || schema

    if (isScalar(contents)) return contents.toLowerCase()

    if (Array.isArray(contents)) return 'list'

    return 'map'
}

function readYaml(filePath) {
    try {
        return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
        if (e instanceof yaml.YAMLException) throw exceptions.yamlLoadFile(filePath, e)
        else throw exceptions.readFile(filePath)
    }
}

function writeFile(filePath, contents) {
    try {
        // create dir if it doesn't already exist
        let dirPath = path.dirname(filePath)
        try { fs.statSync(dirPath) }
        catch(e) { mkdirp.sync(dirPath) }

        fs.writeFileSync(filePath, contents, { flag: 'w+' })
    } catch (e) {
        throw exceptions.writeFile(filePath)
    }
}
