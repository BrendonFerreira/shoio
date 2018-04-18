const Waterline = require('waterline')
const DiskAdapter = require('sails-disk')

function ORM ( config ) {
	return new Promise( function(resolve,reject){

		Waterline.start(config, function(err, orm) {

			if( err ) {
				reject(err)
				return
			}
			resolve(orm)
		})
	})
}
module.exports = function Model( config ) {

	const modelsConfig = {}

    async function extend( a ){

		a.prototype.$model = null

		a.prototype.$orm = null

        a.prototype.$orm = ORM({
			adapters: {
				'sails-disk': DiskAdapter
			},

			datastores: {
				default: {
					adapter: 'sails-disk'
				}
			},

			models: {},

			defaultModelSettings: {
				primaryKey: 'id',
				datastore: 'default',
				attributes: {
				id: { type: 'number', autoMigrations: { autoIncrement: true } },
				},
			}
		})

    }

    async function mount(){ 

		if( 'model' in this.$options ) {

			if( 'schema' in this.$options.model ) {
				
				console.log( Object.keys( this ) )

			}

		}
    }

    return {
        $mount: mount,
        $extend: extend
    }

}