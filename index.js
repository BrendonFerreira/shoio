const createRoute = (name, path) => ({
	path,
	name,
	modules: [{
		path: '/',
		method: 'get',
		action: 'list',
	}, {
		path: '/:id',
		method: 'get',
		action: 'getById'
	}, {
		path: '/',
		method: 'post',
		action: 'create'
	}, {
		path: '/:id',
		method: 'put',
		action: 'update'
	}, {
		path: '/:id',
		method: 'delete',
		action: 'delete'
	}]
})

const isArrowFunction = (fn) => {
	console.log( fn.toString() )
	return fn.toString().indexOf('=>') > 0
}
module.exports = () => {

	const express = require('express')
	const bluebird = require('bluebird')
	const bodyParser = require('body-parser')
	const morgan = require('morgan')
	const path = require('path')
	const fs = require('fs')

	const App = {
		config: {
			defaultPort: 3001,
			defaultRenderer: 'pug',
			viewsPath: 'views',
		},
		queue: [],
		$models: {},

		getDatabaseAdapter(name) {
			return this.config.adapter[name || 'sqlite']
		},

		async listen(port = 3000, callback) {

			await bluebird.all(App.queue)

			let server = express()

			server.set('view engine', App.config.defaultRenderer) // Pug está estatico por enquanto
			server.set('views', App.config.viewsPath)
			server.use(morgan('dev'))
			server.use(bodyParser.json())

			for (let route of this.routes.list) {

				const registerRoute = (app, method, path, moduleName, controllerActionName) => {

					const _module = this.modules.getModule(moduleName)

					const handler = async (request, response, next) => {

						_module.scope.$models = this.$models

						_module.scope.render = (page, data) => {
							response.render(page, data)
							response.end()
						}

						const method = _module.controller.call(_module.scope)[controllerActionName]
						
						// method.bind(_module.scope)
						
						const methodReturn = method(request, response)

						if (methodReturn) {
							if (methodReturn instanceof Promise) {
								response.json(await methodReturn)
							} else {
								response.json(methodReturn)
							}
							response.end()
						} else {
							next()
						}
					}

					server[method](path, handler)
				}

				if (route.modules) {
					for (let child of route.modules) {
						const path = '/' + route.path + child.path;
						try {
							registerRoute(server, child.method, path, route.name, child.action)
						} catch (error) {
							console.error('Route registering', error)
						}
					}
				} else {

					const path = '/' + route.path;
					try {
						registerRoute(server, route.method, path, route.name, route.action)
					} catch (error) {
						console.error('Route registering', error)
					}
				}
			}

			if( port instanceof Number ) {
				server.listen(port)
			} else {
				server.listen( App.config.defaultPort, () => port(App.config.defaultPort) )
			}

		}
	}

	

	App.start = App.listen
	App.up = App.listen

	App.defaultRoute = {
		method: 'get',
		path: '/',
		action: 'index'
	}

	const parseRoute = (route) => {
		const [name, action] = route.action.split('#')
		return {
			...route,
			action,
			name,
		}
	}

	App.routes = {

		list: [],

		register(toRegister) {
			if (toRegister instanceof Array) {
				for (let item of toRegister) {
					this.register(item)
				}
			} else if (toRegister.resource && toRegister.path) {
				this.list.push(createRoute(toRegister.resource, toRegister.path))
			} else {
				this.list.push({
					...App.defaultRoute,
					...parseRoute(toRegister)
				})
			}
		}

	}

	App.registerModel = function (name, model) {
		this.$models[name] = model
	}

	App.createModel = async function (config) {
		const db = await this.getDatabaseAdapter(config.model.adapter)
		const model = db.model(config.name, config.model.schema)
		this.registerModel(config.name, model)
		return model
	}

	App.modules = {

		list: [],

		getModule(name) {
			return this.list.find(item => item.name == name)
		},

		getModuleController(name) {
			if (!this.getModule(name)) {
				throw new Error(`Module "${name}" not found, are you sure you've registered?`)
			}
			return this.getModule(name).controller
		},

		register(config) {
			
			const asyncRegister = async function (cf) {

				const model = 
					( Object.keys( cf.model ).length > 0 ) 
						? await App.createModel(cf)
						: {}
			
				
				const _module = {
					...cf,
					model	
				}
				

				_module.scope = _module
				_module.controller = cf.controller

				this.list.push(_module)

			}.bind(this)

			if( config instanceof Array ){
				for( childConfig of config ){
					App.queue.push(asyncRegister(childConfig))
				}
			} else {
				App.queue.push(asyncRegister(config))
			}
		}
	}

	App.configure = function (config) {
		Object.assign(App.config, config)
	}

	return App
}
