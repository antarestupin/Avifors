const chalk = require('chalk')

module.exports = {
    noConfig: () => "You must indicate at least one config file using the 'config-src' option",

    // FS

    readFile: filePath => `Tried to read non existent file ${chalk.bold(filePath)}`,

    writeFile: filePath => `Could not write file ${chalk.bold(filePath)}`,

    readTemplateFile: (templatePath, fallbackPath, itemType) => {
        return `Neither template or fallback template file could be read for item of type ${itemType}\n\n`
            + `${chalk.underline('Template path')}: ${templatePath}\n\n`
            + `${chalk.underline('Fallback path')}: ${fallbackPath}`
    },

    // YAML parsing errors

    yamlLoadFile: (filePath, e) => {
        return `Syntax error in the YAML file ${chalk.bold(filePath)}\n\n${chalk.underline('Reason')}: ${e.message}`
    },

    yamlLoadArgs: e => `Syntax error in given item arguments\n\n${chalk.underline('Reason')}: ${e.message}`,

    yamlLoadConfigOutputs: (item, e) => {
        return `Syntax error in the rendered outputs option in the configuration of ${chalk.bold(item)}\n\n`
            + `${chalk.underline('Reason')}: ${e.message}`
    },

    // Nunjucks rendering errors

    nunjucksRenderTemplate: (templatePath, e) => {
        return `Error while rendering the template ${chalk.bold(templatePath)}\n\n`
            + `${chalk.underline('Reason')}: ${e.message}`
    },

    nunjucksRenderOption: (option, item, e) => {
        return `Error while rendering the ${chalk.bold(option)} option in the configuration of ${chalk.bold(item)}\n\n`
            + `${chalk.underline('Option')}: ${chalk.bold(item + '.' + option)}\n\n`
            + `${chalk.underline('Reason')}: ${e.message}`
    }
}
