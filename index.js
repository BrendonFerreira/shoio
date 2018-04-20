
const ShoioModule = require('../shoio-core')
const ServerMixin = require('./lib/server')
const ModelMixin = require('./lib/model')
const ScaffoldMixin = require('./lib/scaffold')

ShoioModule.use( ScaffoldMixin )
ShoioModule.use( ServerMixin )
ShoioModule.use( ModelMixin )

module.exports = ShoioModule