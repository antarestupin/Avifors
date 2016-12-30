const yaml = require('js-yaml')
const globalContainer = require('../common/container')

// display the contents of a file
readFile = (path, { fs } = globalContainer) => fs.readFileSync(path, 'utf8')

module.exports = {
    _: (cond, joiner='\n') => cond ? joiner: '',
    readFile: readFile
}
