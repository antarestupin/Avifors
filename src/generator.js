const yaml = require('js-yaml')
const helpers = require('./helpers')
const fs = require('fs')
const exceptions = require('./exceptions')
const defaults = require('./defaults')

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
        // case in which the type is a list of items of another type
        if (config[item.type].list) {
            config[item.type].outputs = []
            item.arguments[item.type].forEach(argItem => {
                config[item.type].originOutputs.forEach((output, outputIndex) => {
                    let templatePath, fallbackPath, outputPath

                    try { templatePath = nunjucksEnv.renderString(output.template, argItem) }
                    catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].template`, item.type, e) }

                    if (output.fallback) {
                        try { fallbackPath = nunjucksEnv.renderString(output.fallback, argItem) }
                        catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].fallback`, item.type, e) }
                    }

                    try { outputPath = nunjucksEnv.renderString(output.output, argItem) }
                    catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].output`, item.type, e) }

                    config[item.type].outputs.push({
                        template: templatePath,
                        fallback: fallbackPath,
                        optional: output.optional,
                        arguments: defaults.getWithDefaultArguments(argItem, config[config[item.type].origin].arguments),
                        output: outputPath
                    })
                })
            })
        } else { // not a list of items
            // set default arguments
            item.arguments = defaults.getWithDefaultArguments(item.arguments, config[item.type].arguments)
        }

        // compute the outputs defined by a template
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
            // every argument is passed by default
            if (!output.arguments) output.arguments = item.arguments

            // add local variables
            output.arguments._args = item.arguments // useful for list items

            // get template and output paths
            let templatePath, fallbackPath, outputPath

            try {
                templatePath = nunjucksEnv.renderString(output.template, item.arguments)
                if (!!output.fallback) fallbackPath = nunjucksEnv.renderString(output.fallback, item.arguments)
            }
            catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].template`, item.type, e) }

            try { outputPath = nunjucksEnv.renderString(output.output, output.arguments) }
            catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].output`, item.type, e) }

            let template
            try { template = fs.readFileSync(templatePath, 'utf8') }
            catch (e) {
                if (fallbackPath) template = fs.readFileSync(fallbackPath, 'utf8')
                else if (output.optional) return
                else throw e
            }

            let rendered
            try { rendered = nunjucksEnv.renderString(template, output.arguments) }
            catch (e) { throw exceptions.nunjucksRenderTemplate(templatePath, e) }

            helpers.writeFile(outputPath, rendered)
        })
    })
}
