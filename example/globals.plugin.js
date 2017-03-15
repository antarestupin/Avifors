module.exports.default = function(avifors) {
  avifors.nunjucks.addGlobal('global', {
    'companyName': 'ACME'
  })
}
