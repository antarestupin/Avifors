/**
 * Core types
 */
export function getTypes(avifors) {
  const types = {
    list: (children, { validators = [], builders = [] } = {}) => ({
      type: 'list',
      build: value => {
        let result = value.map(i => children.build(i))
        builders.forEach(builder => result = builder(result))
        return result
      },
      normalize: () => [children.normalize()],
      validate: (i, path) => {
        avifors.assert(Array.isArray(i), `${path} must be a list, ${i} given`)
        avifors.validate(validators, i, path)
        i.forEach((v,j) => children.validate(v, `${path}[${j}]`))
      }
    }),

    map: (keys, { validators = [], builders = [] } = {}) => ({
      type: 'map',
      build: value => {
        let result = {}
        for (let i in keys) {
          result[i] = keys[i].build(value[i])
        }
        builders.forEach(builder => result = builder(result))
        return result
      },
      normalize: () => {
        let result = {}
        for (let i in keys) {
          result[i] = keys[i].normalize()
        }
        return result
      },
      validate: (i, path) => {
        avifors.assert(typeof i === 'object' && !Array.isArray(i), `${path} must be a map, ${i} given`)
        avifors.validate(validators, i, path)
        for (let j in i)    avifors.assert(j in keys, `Unexpected key "${j}" in ${path}`)
        for (let j in keys) keys[j].validate(i[j], `${path}.${j}`)
      }
    }),

    optional: {}
  }

  setBasicTypes(types, avifors)

  return types
}

function setBasicTypes(types, avifors) {
  const basicTypes = ['string', 'number', 'boolean']
  const buildBasicType = (type, optional) => ({ validators = [], builders = [] } = {}) => {
    if (!optional) {
      validators.push(avifors.validators.required())
    }

    return {
      type: type,
      build: value => {
        let result = value
        builders.forEach(builder => result = builder(result))
        return result
      },
      normalize: () => type + (validators.length ? ` (${ validators.map(v => v.normalize()).join(', ') })`: ''),
      validate: (i, path) => {
        avifors.assert(typeof i === type || i == null, `${path} must be a ${type}, "${i}" given`)
        avifors.validate(validators, i, path)
      }
    }
  }

  basicTypes.forEach(type => {
    types[type] = buildBasicType(type, false)
    types.optional[type] = buildBasicType(type, true)
  })
}
