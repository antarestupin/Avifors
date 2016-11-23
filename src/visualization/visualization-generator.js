const path = require('path')
const glob = require('glob')
const helpers = require('../helpers')
const modelFunctions = require('../model')

module.exports = {
    generateVisualization: generateVisualization
}

function generateVisualization(model, config, displayParamsPathList, output, nunjucksEnv) {
    // get display configuration
    let displayParams = displayParamsPathList
        .map(src => glob.sync(src, { nodir: true })) // get the list of files matching given pattern
        .reduce((a,b) => a.concat(b)) // flatten it to one list
        .map(src => helpers.readYaml(src))
        .reduce((a,b) => Object.assign({}, a, b))

    // add ids to the model
    model.forEach((item, index) => Object.assign(item, { id: index }))

    const displayArgs = node => {
        switch (helpers.getType(node)) {
            case 'scalar':
                return node
            case 'list':
                return `<ul style="list-style-type:none; padding-left:1em; padding-right: 1em">${node.map(i => `<li>- ${node.length ? displayArgs(i): '[]'}</li>`).join('')}</ul>`
            case 'map':
                if (Object.keys(node).length === 0) return '{}'

                let res = '<ul style="list-style-type:none; padding-left:1em; padding-right: 1em">'
                for (let i in node) res += `<li><b>${i}</b>: ${displayArgs(node[i])}</li>`
                res += '</ul>'

                return res
        }
    }

    const addEdge = node => {
        const findInModel = str => modelFunctions.findInModel(str, model, config, false)
        const findOneInModel = str => findInModel(str)[0]

        let edgeRules = displayParams[node.type].edges
        if (!edgeRules) return ''

        return edgeRules.map(ruleItem => {
            let rule = {}
            for (let i in ruleItem) rule[i] = eval(ruleItem[i])
            let items = rule.items(node)

            switch (helpers.getType(items)) {
                case 'scalar':
                    let item = items,
                        dest = rule.dest(item, node)

                    if (dest) {
                        let type = rule.type ? rule.type(item, dest, node): 'undefined',
                            label = rule.label ? rule.label(item, dest, node): ''

                        return [`edges.push({from: ${node.id}, to: ${dest.id}, arrows: '${type}', width: 1, label: '${label}'})`]
                    }

                    return []

                case 'list':
                    return items.map(item => {
                        let dest = rule.dest(item, node)
                        if (dest) {
                            let type = rule.type ? rule.type(item, dest, node): 'undefined',
                                label = rule.label ? rule.label(item, dest, node): ''

                            return `edges.push({from: ${node.id}, to: ${dest.id}, arrows: '${type}', width: 1, label: '${label}'})`
                        }

                        return ''
                    })

                case 'map':
                    let res = []

                    for (let index in items) {
                        let item = items[index],
                            dest = rule.dest(index, item, node)
                        if (dest) {
                            let type = rule.type ? rule.type(index, item, dest, node): 'undefined',
                                label = rule.label ? rule.label(index, item, dest, node): ''

                            res.push(`edges.push({from: ${node.id}, to: ${dest.id}, arrows: '${type}', width: 1, label: '${label}'})`)
                        }
                    }

                    return res
            }
        })
            .reduce((a,b) => a.concat(b))
            .join('\n')
    }

    let rendered = nunjucksEnv.render(path.resolve(__dirname, 'visualization.template.html'), {
        vis_js_src: path.resolve(__dirname, '../../node_modules/vis/dist/vis.min.js'),
        vis_css_src: path.resolve(__dirname, '../../node_modules/vis/dist/vis.min.css'),
        display_parameters: displayParams,
        nodes: model,
        displayArgs: displayArgs,
        addEdge: addEdge
    })

    helpers.writeFile(output, rendered)
}
