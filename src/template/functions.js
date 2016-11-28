const yaml = require('js-yaml')
const fs = require('fs')

// display the contents of a file
const readFile = path => fs.readFileSync(path, 'utf8')

module.exports = {
    _: (cond, joiner='\n') => cond ? joiner: '',
    readFile: readFile
}
