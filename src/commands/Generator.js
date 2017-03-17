import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import chalk from 'chalk'

export default class Generator {
  constructor(avifors, yamlHelper) {
    this.avifors = avifors
    this.yamlHelper = yamlHelper
  }

  generate(model) {
    model.forEach(item => {
      const generator = this.avifors.getGenerator(item.type)[0]
      this._validateItem(item, generator)
      generator.outputs
        .map(i => i(item.arguments))
        .map(i => ({
          contents: this.avifors.nunjucks.render(i.template, item.arguments),
          ...i
        }))
        .forEach(i => this._writeFile(i.path, i.contents))
    })
  }

  _validateItem(item, generator) {
    try {
      generator.arguments.validate(item.arguments, '')
    } catch(e) {
      throw `${chalk.red(`Error during model item validation:`)} ${e}\n\n`
        + `Item generating this error:\n`
        + this.yamlHelper.print(item.arguments)
    }
  }

  _writeFile(filePath, contents) {
    try {
      let dirPath = path.dirname(filePath)
      try { fs.statSync(dirPath) }
      catch(e) { mkdirp.sync(dirPath) }

      fs.writeFileSync(filePath, contents, { flag: 'w+' })
    } catch (e) {
      throw `Could not write file ${filePath}`
    }
  }
}
