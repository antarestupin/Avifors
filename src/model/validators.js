import chalk from 'chalk'

/**
 * Core validators
 */
export function getValidators(avifors) {
  const validators = {
    required: () => ({
      normalize: () => 'required',
      validate: (i, path) => avifors.assert(i != null, `${path} must be defined`)
    }),

    enum: values => ({
      normalize: () => `enum[${values.join(', ')}]`,
      validate: (i, path) => avifors.assert(
        values.indexOf(i) !== -1,
        `${path} value should be one the following: ${values.map(i => chalk.green(i)).join(', ')}; "${chalk.magenta(i)}" given`
      )
    })
  }

  return validators
}
