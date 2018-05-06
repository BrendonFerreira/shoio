

module.exports = function Scaffold( shoio, config ) {

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
				{ action: 'delete', path: '/:id', method: 'delete' }
			].concat( this.$module.$options.router.routes )
			
		} 

		extendMethods() {

			if( !this.$module.$methods ) {
				this.$module.$methods = {}
			}

			this.$module.$methods = Object.assign({
				async list( ctx ) {
					return await this.$model.find({ where: ctx.data })
				},
			
				async create(ctx) {
					return await this.$model.create( ctx.data )
				},
			
				async getById(ctx) {
					const result = await this.$model.findOne({
						where: {
							id: ctx.data.id 
						}
					})

					if( !result ){
						throw {
							messageUser: this.$name + ' with id:' + ctx.data.id + ' was not found',
							messageDeveloper: 'DATA_NOT_FOUND' 
						}
					} 


					return result
				},
			
				async update( ctx ) {
					let model = await this.getById( ctx )
				
					return await model.updateAttributes(ctx.data)
				},
			
				async delete( ctx ) {
					if( !ctx.data.id ){
						throw {
							'messageUser': 'id não '
						}
					}
					return await this.$model.destroy( {
						where: {
							id: ctx.params.id
						}
					} )
				}
			}, this.$module.$methods || {} )
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