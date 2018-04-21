

module.exports = function Scaffold( config ) {

	class ScaffoldModule {
		constructor( $module ) {
			this.$module = $module

			if( $module.$options.scaffold === true ) {
				this.extendRoutes()
				this.extendMethods()
			}

		}

		extend() {

		}

		extendRoutes() {

			if( !this.$module.$options.router ) {
				this.$module.$options.router = {}
			}

			if( !this.$module.$options.router.base ) {
				this.$module.$options.router.base = this.$module.$name.toLowerCase()
			}

			if( !this.$module.$options.router.routes ) {
				this.$module.$options.router.routes = []
			}

			this.$module.$options.router.routes = [ 
				{ action: 'list', path: '/', method: 'get' },
				{ action: 'getById', path: '/:id', method: 'get' },
				{ action: 'create', path: '/', method: 'post' },
				{ action: 'update', path: '/:id', method: 'put' },
				{ action: 'delete', path: '/:id', method: 'delete' },
				...this.$module.$options.router.routes
			]
			
		} 

		extendMethods() {

			if( !this.$module.$methods ) {
				this.$module.$methods = {}
			}

			this.$module.$methods = {
				async list({ query, pagination }) {
					return await this.$model.findAll(query)
				},
			
				async create(data) {
					return await this.$model.create(data)
				},
			
				async getById(data) {
					return await this.$model.findOne({
						where: {
							id: data.id 
						}
					})
				},
			
				async update({ params, body }) {
					let model = this.$model.update( params.id )
					Object.assign( model, body )
					return await model.save()
				},
			
				async delete({ params }, response) {
					return await this.$model.remove({ id: params.id })
				},

				...this.$module.$methods
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