/**
 * Core builders
 */
export function getBuilders(avifors) {
  const builders = {
    mapDefaultValues: defaultFn => value => Object.assign(defaultFn(value), value)
  }

  return builders
}
