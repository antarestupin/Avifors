const yaml = require('js-yaml')
const helpers = require('./helpers')
const fs = require('fs')
const exceptions = require('./exceptions')
const defaults = require('./defaults')
const modelArgs = require('./modelArgs')

module.exports = (nunjucksEnv) => {
    return {
        generate: (config, data, model, globalVar) => generate(config, data, model, globalVar, nunjucksEnv)
    }
}

// generate the code
function generate(config, data, model, globalVar, nunjucksEnv) {
    // add global variables
    nunjucksEnv.addGlobal('_global', globalVar) // global variables defined in the .avifors.yaml file
    nunjucksEnv.addGlobal('_model', model)

    data.forEach(item => {
        // set undefined arguments to their default value
        item.arguments = defaults.getWithDefaultArguments(item.arguments, config[item.type].arguments)
        item.arguments._args = item.arguments // list of the arguments
        if (!item.arguments._impl) { // add implementation specific arguments
            item.arguments._impl = !!config[item.type].impl_arguments ?
                modelArgs.getImplArguments(config[item.type].impl_arguments, item.arguments, item.type, nunjucksEnv):
                {}
        }

        // generate the outputs section if defined with a template
        if (typeof config[item.type].outputs == 'string') {
            let renderedOutputs = renderOptionString(config[item.type].outputs, item.arguments, nunjucksEnv, item.type, `outputs`)
            try { config[item.type].outputs = yaml.safeLoad(renderedOutputs) }
            catch (e) { throw exceptions.yamlLoadConfigOutputs(item.type, e) }
        }

        // generate the code
        config[item.type].outputs.forEach((output, outputIndex) => {
            let outputArguments = output.arguments || item.arguments // only useful for generated outputs

            // get template and output paths
            let pathListOptions = ['template', 'fallback', 'output']
            let pathList = {}
            pathListOptions.forEach(i => {
                pathList[i] = !!output[i] ?
                    renderOptionString(output[i], item.arguments, nunjucksEnv, item.type, `outputs[${outputIndex}].${i}`):
                    null
            })

            // determine wether the template or the fallback will be used
            let templateOptions = ['template', 'fallback']
            let templateOption = templateOptions.find(i => helpers.fileExists(pathList[i]))
            if (!templateOption) {
                if (output.optional) return
                else throw exceptions.readTemplateFile(pathList.template, pathList.fallback, item.type)
            }

            // get the generated code
            let rendered
            try { rendered = nunjucksEnv.render(pathList[templateOption], outputArguments) }
            catch (e) { throw exceptions.nunjucksRenderTemplate(pathList.template, e) }

            // write the result in the output path
            helpers.writeFile(pathList.output, rendered)
        })
    })
}

// generate the value of an option
function renderOptionString(str, args, nunjucksEnv, type, section) {
    try { return nunjucksEnv.renderString(str, args) }
    catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].template`, item.type, e) }
}
