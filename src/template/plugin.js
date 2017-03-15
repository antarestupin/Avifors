import {filters} from './filters'
import {functions} from './functions'

export default function(avifors) {
  for (let i in filters) {
    avifors.nunjucks.addFilter(i, filters[i])
  }

  for (let i in functions) {
    avifors.nunjucks.addGlobal(i, functions[i])
  }
}
