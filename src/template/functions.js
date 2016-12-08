const yaml = require('js-yaml')
const container = require('../common/container')

// display the contents of a file
const readFile = path => container.get('fs').readFileSync(path, 'utf8')

module.exports = {
    _: (cond, joiner='\n') => cond ? joiner: '',
    readFile: readFile
}
