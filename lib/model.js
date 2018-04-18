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
		  
			operatorsAliases: false
		}); 

	}
	

    async function mount(){ 

		if( 'model' in this.$options ) {

			if( 'schema' in this.$options.model ) {
				
				let name = this.$options.model.name || this.$options.name

				this.$model = await this.$orm.define( name, {
					firstName: {
						type: sequelize.STRING
					},
					lastName: {
						type: sequelize.STRING
					}
				});
				
				await this.$model.sync()

				this.$models[name] = this.$model

			}

		}
    }

    return {
        mount,
        install
    }

}