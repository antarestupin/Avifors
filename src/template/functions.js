const yaml = require('js-yaml')
const globalContainer = require('../common/container')

// display the contents of a file
function readFile(path, container = globalContainer) {
    return container.get('fs').readFileSync(path, 'utf8')
}

module.exports = {
    _: (cond, joiner='\n') => cond ? joiner: '',
    readFile: readFile
}
