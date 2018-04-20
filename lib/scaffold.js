

module.exports = function Scaffold( config ) {

	class ScaffoldModule {
		constructor( $module ) {
			this.$module = $module

			if( $module.$options.scaffold === true ) {
				this.extendRoutes()
				this.extendMethods()
			}

		}

		extendRoutes() {
			this.$module.$options.router = {
				base: this.$module.$name.toLowerCase(),
				routes: [ 
					{ action: 'list', path: '/', method: 'get' },
					{ action: 'getById', path: '/:id', method: 'get' },
					{ action: 'create', path: '/', method: 'post' },
					{ action: 'update', path: '/:id', method: 'put' },
					{ action: 'delete', path: '/:id', method: 'delete' },
				]
			}

			console.log( this.$module.$options.router )
		} 

		extendMethods() {
			this.$module.$methods = {
				async list({ query, pagination }) {
					return await this.$model.findAll(query)
				},
			
				async create({ body }) {
					return await this.$model.create( body )
				},
			
				async getById({ params }) {
					return await this.$model.findOne({ id: params.id })
				},
			
				async update({ params, body }) {
					let model = this.$model.update( params.id )
					Object.assign( model, body )
					return await model.save()
				},
			
				async delete({ params }, response) {
					return await this.$model.remove({ id: params.id })
				}
			}
		}
	}

	function prepare(  ) {
		const scaffold = new ScaffoldModule( this )

	}

	function install() {

	}

	return {
		prepare,
		install
	}

}