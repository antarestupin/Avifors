# Nunjucks templates environment

This section is a reference of what Avifors adds in Nunjucks' templates environment.

Too see how to modify the environment, see [Avifors plugins](https://github.com/antarestupin/Avifors/tree/master/doc/plugins.md#change-environment-of-templates)

## Global variables

Variable | Description
-------- | -----------
`model`  | A reference to your model

## Functions

Function | Description | Example
-------- | ----------- | -------
`_(cond: bool, joiner: string ='\n')` | A helper that returns `joiner` if cond is true, an empty string otherwise; helps if you want a pretty format for your code | `{{ _(not loop.last) }}` → In a loop, adds an empty line at each iteration excepted the last one
`readFile(path: string)` | Reads the file at given path and returns its contents | `{{ readFile('some/json/to/include.json') }}`

## Filters

### Code conventions

Filter | Description | Example
------ | ----------- | -------
`snakecase(str: string \| array)` | Returns `str` snake_cased | `{{ 'awesome-avifors' \| snakecase }}` → `awesome_avifors`
`kebabcase(str: string \| array)` | Returns `str` kebab-cased | `{{ 'awesome-avifors' \| kebabcase }}` → `awesome-avifors`
`camelcase(str: string \| array)` | Returns `str` camelCased | `{{ 'awesome-avifors' \| snakecase }}` → `awesomeAvifors`
`pascalcase(str: string \| array)` | Returns `str` PascalCased | `{{ 'awesome-avifors' \| snakecase }}` → `AwesomeAvifors`
`uppercamelcase(str: string \| array)` | Alias for `pascalcase` |
`lowercamelcase(str: string \| array)` | Alias for `camelcase` |

### String manipulation

Filter | Description | Example
------ | ----------- | -------
`flower(str: string \| array)` | Returns `str` with the first character lowercased | `{{ 'AVIFORS' \| flower }}` → `aVIFORS`
`fupper(str: string \| array)` | Returns `str` with the first character uppercased | `{{ 'avifors' \| fupper }}` → `Avifors`
`prepend(str: string \| array, toPrepend: string)` | Returns `str` + `toPrepend` | `{{ 'avifors' \| prepend('awesome-') }}` → `awesome-avifors`
`append(str: string \| array, toAppend: string)` | Returns `toAppend` + `str` | `{{ 'avifors' \| append('-awesome') }}` → `avifors-awesome`
`surround(str: string \| array, toAdd: string)` | Returns `toAdd` + `str` + `toAdd`  | `{{ 'avifors' \| surround('✨') }}` → `✨avifors✨`

### Collection manipulation

Filter | Description | Example
------ | ----------- | -------
`keys(dict: object)` | Returns object's keys | `{foo: 'bar', baz: 'bla'}` → `['foo', 'baz']`
`values(dict: object)` | Returns object's values | `{foo: 'bar', baz: 'bla'}` → `['bar', 'bla']`
`toArray(dict: object, key: string)` | Transforms `dict` into an array and put each fields' key in `key` | `toArray({a: {b: 'c'}}, 'id') => [{id: 'a', b: 'c'}]`
`findbycolumn(list: array, column: string, value: any)` | Filters a list of objects by the value of one of its columns | `findbycolumn([{foo: 'bar', val: 'val1'}, {foo: 'baz', val: 'val2'}], 'foo', 'bar') => [{foo: 'bar', val: 'val1'}]`
`findonebycolumn(list: array, column: string, value: any)` | Same as above, but returns only one result | `findbycolumn([{foo: 'bar', val: 'val1'}, {foo: 'baz', val: 'val2'}], 'foo', 'bar') => {foo: 'bar', val: 'val1'}`
`map(list: array, fn: string` | Applies `map` on given list with `eval(fn)` as the mapper function | `map(['40', '50'], 'i => "$"+i') => ['$40', '$50']`
`filter(list: array, fn: string` | Applies `filter` on given list with `eval(fn)` as the filter function | `map(['40', '50'], 'i => i > 45') => ['50']`

### Data formatting

Filter | Description | Example
------ | ----------- | -------
`json(toDump: any)` | Returns a JSON dump of `toDump` |
`jsonparse(json: string)` | Parses `json` and returns the result |
`yaml(toDump: any)` | Returns a YAML dump of `toDump` |
`yamlparse(yaml: string)` | Parses `yaml` and returns the result |

### Other

Filter | Description | Example
------ | ----------- | -------
`apply(val: any, fn: string)` | Applies given function to `val` (`fn` is an `eval`ed string) | `{{ 'avifors' \| apply("i => i.repeat(3)") }}` → `aviforsaviforsavifors`
