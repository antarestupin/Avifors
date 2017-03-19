import {getTypes} from './types'
import {getValidators} from './validators'

export default function(avifors) {
  const types = getTypes(avifors)
  for (let i in types) {
    avifors.setType(i, types[i])
  }

  const validators = getValidators(avifors)
  for (let i in validators) {
    avifors.setValidator(i, validators[i])
  }
}
