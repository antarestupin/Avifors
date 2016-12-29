const yaml = require('js-yaml')
const helpers = require('../common/helpers')
const exceptions = require('../common/exceptions')
const defaults = require('../common/defaults')
const modelArgs = require('../common/modelArgs')
const globalContainer = require('../common/container')

module.exports = {
    generate: generate,
    _setDefaultArguments: setDefaultArguments,
    _setOutputs: setOutputs,
    _getPathList: getPathList,
    _getTemplateOption: getTemplateOption,
    _getRenderedCode: getRenderedCode,
    _renderOptionString: renderOptionString
}

// generate the code
function generate(config, data, model, globalVar, container = globalContainer) {
    const nunjucksEnv = container.get('nunjucksEnv')

    // add global variables
    nunjucksEnv.addGlobal('_global', globalVar) // global variables defined in the .avifors.yaml file
    nunjucksEnv.addGlobal('_model', model)

    data.forEach(item => {
        // set undefined arguments to their default value
        setDefaultArguments(item, config, modelArgs)

        // generate the outputs section if defined with a template
        setOutputs(config, item)

        // generate the code
        config[item.type].outputs.forEach((output, outputIndex) => {
            let outputArguments = output.arguments || item.arguments // only useful for generated outputs

            // get template and output paths
            let pathList = getPathList(output, item, outputIndex)

            // determine wether the template or the fallback will be used
            let templateOption = getTemplateOption(pathList)
            if (!templateOption) {
                if (output.optional) return
                else throw exceptions.readTemplateFile(pathList.template, pathList.fallback, item.type)
            }

            // get the generated code
            let rendered = getRenderedCode(pathList, templateOption, outputArguments)

            // write the result in the output path
            helpers.writeFile(pathList.output, rendered)
        })
    })
}

function setDefaultArguments(item, config, modelArgs) {
    item.arguments = defaults.getWithDefaultArguments(item.arguments, config[item.type].arguments)
    item.arguments._args = item.arguments // list of the arguments
    if (!item.arguments._impl) { // add implementation specific arguments
        item.arguments._impl = !!config[item.type].impl_arguments ?
            modelArgs.getImplArguments(config[item.type].impl_arguments, item.arguments, item.type):
            {}
    }
}

function setOutputs(config, item) {
    if (typeof config[item.type].outputs == 'string') {
        let renderedOutputs = renderOptionString(config[item.type].outputs, item.arguments, item.type, `outputs`)
        try { config[item.type].outputs = yaml.safeLoad(renderedOutputs) }
        catch (e) { throw exceptions.yamlLoadConfigOutputs(item.type, e) }
    }
}

function getPathList(output, item, outputIndex) {
    let pathListOptions = ['template', 'fallback', 'output']
    let pathList = {}
    pathListOptions.forEach(i => {
        pathList[i] = !!output[i] ?
            renderOptionString(output[i], item.arguments, item.type, `outputs[${outputIndex}].${i}`):
            null
    })

    return pathList
}

function getTemplateOption(pathList) {
    return ['template', 'fallback'].find(i => helpers.fileExists(pathList[i]))
}

function getRenderedCode(pathList, templateOption, outputArguments, container = globalContainer) {
    try {
        return rendered = container.get('nunjucksEnv').render(pathList[templateOption], outputArguments)
    }
    catch (e) {
        throw exceptions.nunjucksRenderTemplate(pathList.template, e)
    }
}

// generate the value of an option
function renderOptionString(str, args, type, section, container = globalContainer) {
    try { return container.get('nunjucksEnv').renderString(str, args) }
    catch (e) { throw exceptions.nunjucksRenderOption(`outputs[${outputIndex}].template`, item.type, e) }
}
