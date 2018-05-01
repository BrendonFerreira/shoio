
const { DataSource } = require('loopback-datasource-juggler')
const { RelationTypes } = require('loopback-datasource-juggler/lib/relation-definition')

module.exports = function Model( shoio, config ) {

	const modelsConfig = {}

	const models = {}


    function install( a ){

		a.prototype.$model = null
		
		a.prototype.$models = models

		a.prototype.$orm = new DataSource( config.datasource.name, config.datasource ); 

		console.log( Date.now() )

	}

    async function mounted(){ 

		if( 'model' in this.$options ) {

			if( 'schema' in this.$options.model ) {
				
				let name = this.$options.model.name || this.$options.name

				this.$model = await this.$orm.define( name, this.$options.model.schema(DataSource) );

				const relationTypes = Object.keys( RelationTypes ).reduce( (prev, type) => {
					prev[type] = ( model, ...configs ) => {
						return {
							type,
							model,
							configs: configs || []
						}
					}
					return prev
				}, {})

				if( 'relations' in this.$options.model ) {
				
					const relations = this.$options.model.relations( relationTypes )

					for( const relation of relations ) {
						this.$model[relation.type]( this.$orm.define( relation.model, {} ), ...relation.configs )
					}
				
				}

				this.$models[name] = this.$model

			}

		}
    }

    return {
		// beforeMount,
        mounted,
        install
    }

}