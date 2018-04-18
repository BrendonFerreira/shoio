
const ShoioModule = require('../shoio-core')
const ServerMixin = require('./lib/server')
const ModelMixin = require('./lib/model')

ShoioModule.use( ServerMixin )
ShoioModule.use( ModelMixin )

module.exports = ShoioModule