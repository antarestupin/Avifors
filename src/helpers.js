const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const exceptions = require('./exceptions')

module.exports = {
    getArgType: getArgType,
    readYaml: readYaml,
    writeFile: writeFile,
    isScalar: isScalar,
    fileExists: fileExists
}

// say if a file exists
function fileExists(filePath) {
    try {
        fs.readFileSync(filePath, 'utf8')
        return true
    } catch (e) {
        return false
    }
}

// say wether a val is scalar or not
function isScalar(val) {
    return (/string|number|boolean/).test(typeof val)
}

// get the type of a model argument
function getArgType(schema) {
    let contents = schema._contents || schema

    if (isScalar(contents)) return contents.toLowerCase()

    if (Array.isArray(contents)) return 'list'

    return 'map'
}

// read and parse a yaml file
function readYaml(filePath) {
    try {
        return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
        if (e instanceof yaml.YAMLException) throw exceptions.yamlLoadFile(filePath, e)
        else throw exceptions.readFile(filePath)
    }
}

// write contents to a file and create its parent dir if it doesn't already exist
function writeFile(filePath, contents) {
    try {
        let dirPath = path.dirname(filePath)
        try { fs.statSync(dirPath) }
        catch(e) { mkdirp.sync(dirPath) }

        fs.writeFileSync(filePath, contents, { flag: 'w+' })
    } catch (e) {
        throw exceptions.writeFile(filePath)
    }
}
