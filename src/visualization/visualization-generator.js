const path = require('path')
const helpers = require('../helpers')

module.exports = {
    generateVisualization: generateVisualization
}

function generateVisualization(model, config, output, nunjucksEnv) {
    let rendered = nunjucksEnv.render(path.resolve(__dirname, 'visualization.template.html'), {
        'vis_js_src': path.resolve(__dirname, '../../node_modules/vis/dist/vis.min.js'),
        'vis_css_src': path.resolve(__dirname, '../../node_modules/vis/dist/vis.min.css')
    })

    helpers.writeFile(output, rendered)
}
