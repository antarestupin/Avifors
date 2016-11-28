const yaml = require('js-yaml')

module.exports = {
    findInModel: findInModel,
    findOneInModel: (request, model, config) => findInModel(request, model, config)[0]
}

// Find in the model every item corresponding to given filter following the format type{argumentKey: value}
// ex: entity{name: user, methods: {name: clear_basket}}
function findInModel(request, model, config, returnProperties=true) {
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
        .filter(item => filterItems(item.arguments, itemFilters))
        .map(i => returnProperties ? i.arguments: i)
}
