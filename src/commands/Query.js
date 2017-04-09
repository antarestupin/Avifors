import chalk from 'chalk'

export default class Query {
  constructor(avifors, model) {
    this.avifors = avifors
    this.model = model
  }

  executeQuery(argv) {
    const queryName = argv._[1]
    if (queryName === undefined) {
      this.printQueries()
      return
    }

    const query = this.avifors.getQuery(queryName)
    let args = {}
    argv._.slice(2).forEach((arg,i) => args[query.arguments[i]] = arg)

    this.avifors.helpers.printYaml(query.resolve({
      model: this.model,
      argv: argv._.slice(2),
      avifors: this.avifors
    }, args))
  }

  printQueries() {
    Object.keys(this.avifors.queries)
      .map(query => chalk.cyan(query) + "\t" + chalk.gray((this.avifors.queries[query].arguments || []).join(', ')) + "\t" + this.avifors.queries[query].description)
      .forEach(i => console.log(i))
  }
}
