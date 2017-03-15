import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

export default class Generator {
  constructor(avifors) {
    this.avifors = avifors
  }

  generate(model) {
    model.forEach(item => {
      this.avifors.getGenerator(item.type)[0].outputs
        .map(i => i(item.arguments))
        .map(i => ({
          contents: this.avifors.nunjucks.render(i.template, item.arguments),
          ...i
        }))
        .forEach(i => this._writeFile(i.path, i.contents))
    })
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
