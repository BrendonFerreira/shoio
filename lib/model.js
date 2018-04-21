const sequelize = require('sequelize')


module.exports = function Model( config ) {

	const modelsConfig = {}

	const models = {}

    function install( a ){

		a.prototype.$model = null
		
		a.prototype.$models = models

		a.prototype.$orm = new sequelize('database', 'username', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
		  
			pool: {
			  max: 5,
			  min: 0,
			  acquire: 30000,
			  idle: 10000
			},
		  
			storage: './database.sqlite',
		  
			logging: false,
			operatorsAliases: false
		}); 

	}

    async function mounted(){ 

		if( 'model' in this.$options ) {

			if( 'schema' in this.$options.model ) {
				
				let name = this.$options.model.name || this.$options.name

				this.$model = await this.$orm.define( name, this.$options.model.schema(sequelize) );

				const relationTypes = [ 'hasMany', 'belongsTo', 'hasOne', 'belongsToMany' ]
					.reduce( (prev, type) => {
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

				await this.$model.sync()

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