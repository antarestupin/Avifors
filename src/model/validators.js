/**
 * Core validators
 */
export function getValidators(avifors) {
  const validators = {
    required: () => ({
      normalize: () => 'required',
      validate: (i, path) => avifors.assert(i != null, `${path} must be defined`)
    })
  }

  return validators
}
