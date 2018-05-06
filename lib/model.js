
const { DataSource } = require('loopback-datasource-juggler')
const { RelationTypes } = require('loopback-datasource-juggler/lib/relation-definition')

module.exports = function Model( shoio, config ) {

	const modelsConfig = {}

	const models = {}


    function install( a ){

		a.prototype.$model = null
		
		a.prototype.$models = models

		a.prototype.$orm = new DataSource( config.datasource.name, config.datasource ); 

		a.prototype.$orm.automigrate(function () {
			// a.prototype.$orm.discoverModelProperties('CUSTOMER_TEST', function (err, props) {
			//   console.log(props);
			// });
		});

		console.log( Date.now() )

	}

    async function mounted(){ 

		if( 'model' in this.$options ) {

			if( 'schema' in this.$options.model ) {
				
				let name = this.$options.model.name || this.$options.name

				this.$model = await this.$orm.define( name, this.$options.model.schema(DataSource) );

				const relationTypes = Object.keys( RelationTypes ).reduce( (prev, type) => {
					prev[type] = function( model ) {
						return {
							type,
							model,
							configs: Array.from(arguments).filter( ( x, index ) => index > 0 )
						}
					}
					return prev
				}, {})

				if( 'relations' in this.$options.model ) {
				
					const relations = this.$options.model.relations( relationTypes )

					for( const relation of relations ) {
						const model = this.$orm.define( relation.model, {} )

						this.$model[relation.type].apply( this.$model, [ model ].concat(relation.configs) )
					}
				
				}

				this.$models[name] = this.$model

			}

		}
    }

    return {
        mounted,
        install
    }

}