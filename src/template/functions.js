const yaml = require('js-yaml')
const fs = require('fs')

module.exports = (nunjucksEnv, model, config) => {
    let functions = {
        _: (cond, joiner='\n') => cond ? joiner: '',
        findInModel: str => findInModel(str, model, config),
        findOneInModel: str => findInModel(str, model, config)[0],
        readFile: readFile
    }

    for (let i in functions) nunjucksEnv.addGlobal(i, functions[i])
}

// Find in the model every item corresponding to given filter following the format type{argumentKey: value}
// ex: entity{name: user, methods: {name: clear_basket}}
function findInModel(request, model, config) {
    let sepatatorIndex = request.indexOf('{')
    let itemType = request.substr(0, sepatatorIndex)
    let itemFilters = yaml.safeLoad(request.substr(sepatatorIndex))

    function filterItems(modelSubTree, filters) {
        let res = true

        for (let i in filters) {
            let subTree = modelSubTree
            i.split('.').forEach(j => subTree = subTree[j])

            if (typeof subTree == 'string') res = res && subTree === filters[i]
            else if (Array.isArray(modelSubTree)) res = res && modelSubTree.some(i => filterItems(i, filters))
            else res = res && filterItems(subTree, filters[i])
        }

        return res
    }

    return model
        .filter(i => i.type == itemType)
        .map(i => i.arguments)
        .filter(item => filterItems(item, itemFilters))
}

// display the contents of a file
const readFile = path => fs.readFileSync(path, 'utf8')
