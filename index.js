
const ShoioModule = require('@shoio/core')
const ServerMixin = require('./lib/server')
const ModelMixin = require('./lib/model')
const ScaffoldMixin = require('./lib/scaffold')


module.exports = function( cfg ) {

	ShoioModule.use( ScaffoldMixin, cfg )
	ShoioModule.use( ServerMixin, cfg )
	ShoioModule.use( ModelMixin, cfg )

	return new ShoioModule( cfg )

}