const yaml = require('js-yaml')
const helpers = require('./helpers')
const fs = require('fs')
const exceptions = require('./exceptions')
const defaults = require('./defaults')
const modelArgs = require('./modelArgs')

module.exports = (nunjucksEnv) => {
    return {
        generate: (args) => generate(args, nunjucksEnv)
    }
}

// generate the code
function generate({config: config, data: data, model: model, global: globalVar}, nunjucksEnv) {
    // add global variables
    nunjucksEnv.addGlobal('_global', globalVar) // global variables defined in the .avifors.yaml file
    nunjucksEnv.addGlobal('_model', model)

    data.forEach(item => {
        // set default arguments
        item.arguments = defaults.getWithDefaultArguments(item.arguments, config[item.type].arguments)
        item.arguments._args = item.arguments // useful for list items
        // add implementation specific arguments
        if (!item.arguments._impl) {
            item.arguments._impl = !!config[item.type].impl_arguments ?
                modelArgs.getImplArguments(config[item.type].impl_arguments, item.arguments, item.type, nunjucksEnv):
                {}
        }

        // compute the outputs defined with a template
        if (typeof config[item.type].outputs == 'string') {
            try {
                config[item.type].outputs = yaml.safeLoad(nunjucksEnv.renderString(config[item.type].outputs, item.arguments))
            } catch (e) {
                if (e instanceof yaml.YAMLException) throw exceptions.yamlLoadConfigOutputs(item.type, e)
                else throw exceptions.nunjucksRenderOption('outputs', item.type, e)
            }
        }


        // generate the code
        config[item.type].outputs.forEach((output, outputIndex) => {
            let outputArguments = output.arguments || item.arguments

            // get template and output paths
            let templatePath, fallbackPath, outputPath

            try {
                templatePath = nunjucksEnv.renderString(output.template, item.arguments)
                if (!!output.fallback) fallbackPath = nunjucksEnv.renderString(output.fallback, item.arguments)
            }
            catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].template`, item.type, e) }

            outputPath = renderString(output.output, item.arguments, nunjucksEnv, item.type, `outputs[${outputIndex}].output`)

            let template
            try { template = fs.readFileSync(templatePath, 'utf8') }
            catch (e) {
                if (fallbackPath) template = fs.readFileSync(fallbackPath, 'utf8')
                else if (output.optional) return
                else throw e
            }

            let rendered
            try { rendered = nunjucksEnv.renderString(template, outputArguments) }
            catch (e) { throw exceptions.nunjucksRenderTemplate(templatePath, e) }

            helpers.writeFile(outputPath, rendered)
        })
    })
}

function renderString(str, args, nunjucksEnv, type, section) {
    try { return nunjucksEnv.renderString(str, args) }
    catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].template`, item.type, e) }
}
