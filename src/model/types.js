/**
 * Core types
 */
export function getTypes(avifors) {
  const types = {}

  setListType(types, avifors)
  setMapType(types, avifors)
  setOneOfType(types, avifors)
  setBasicTypes(types, avifors)

  return types
}

function setListType(types, avifors) {
  types.list = (children, { validators = [], builders = [] } = {}) => ({
    type: 'list',
    build: (value = []) => {
      let result = value.map(i => children.build(i))
      builders.forEach(builder => result = builder(result))
      return result
    },
    normalize: () => [children.normalize()],
    validate: (i, path) => {
      avifors.assert(i == null || Array.isArray(i), `${path} must be a list, ${i} given`)
      avifors.validate(validators, i, path)
      if (i == null) {
        return
      }
      i.forEach((v,j) => children.validate(v, `${path}[${j}]`))
    }
  })
}

function setMapType(types, avifors) {
  types.map = (keys, { validators = [], builders = [], defaults = () => ({}), strict = true } = {}) => ({
    type: 'map',
    build: (value = {}) => {
      let result = {}
      for (let i in keys) {
        result[i] = keys[i].build(value[i])
      }
      result = Object.assign(defaults(result), result)
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
      avifors.assert(i == null || (typeof i === 'object' && !Array.isArray(i)), `${path} must be a map, ${i} given`)
      avifors.validate(validators, i, path)
      if (i == null) {
        return
      }
      for (let j in i) {
        if (strict) {
          avifors.assert(j in keys, `Unexpected key "${j}" in ${path}`)
        }
        if (j in keys) {
          keys[j].validate(i[j], `${path}.${j}`)
        }
      }
    }
  })
}

function setOneOfType(aTypes, avifors) {
  aTypes.oneOf = (types, builder) => {
    const getType = (value, path = '') => {
      return types.find(t => {
        try {
          return t.validate(value, path) == undefined
        } catch (e) {
          return false
        }
      })
    }
    const getTypeIndex = value => types.indexOf(getType(value))

    return {
      type: 'oneOf',
      build: value => {
        const typeIndex = getTypeIndex(value)
        return types[typeIndex].build(builder(value, typeIndex))
      },
      normalize: () => ({ 'one of': types.map(i => i.normalize()) }),
      validate: (i, path) => avifors.assert(getType(i, path) !== undefined, `Could not resolve ${path}: no type could validate given value`)
    }
  }
}

function setBasicTypes(types, avifors) {
  const basicTypes = ['string', 'number', 'boolean']
  const buildBasicType = type => ({ validators = [], builders = [] } = {}) => {
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

  basicTypes.forEach(type => types[type] = buildBasicType(type))
}
