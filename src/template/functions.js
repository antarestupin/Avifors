import yaml from 'js-yaml'
import fs from 'fs'

export const functions = {
  _: (cond, joiner='\n') => cond ? joiner: '',
  readFile: path => fs.readFileSync(path, 'utf8')
}
