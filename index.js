const WebServer = require('./lib/webServer')
const createDefaultRoutes = require('./lib/createDefaultRoutes')
const defaultController = require('./lib/defaultController')
const RequestHandlerFactory = require('./lib/requestHandlerFactory')

module.exports = (base_path) => {

	const bluebird = require('bluebird')
	const path = require('path')

	const App = {
		config: {
			debugRouteSpawn: true,
			defaultPort: 3001,
			defaultRenderer: 'pug',
			middlewheres: [],
			path: {
				views: 'src/views',
				modules: 'src/modules',
				routesFile: 'src/config/routes'
			}
		},
		queue: [],
		$models: {},

		webServer: new WebServer(),

		init(base_path) {
			const fs = require('fs')
			const path = require('path')

			const routesPath = path.join(base_path, this.config.path.routesFile)
			const modulesPath = path.join(base_path, this.config.path.modules)
			const getRelativePath = (src) => `${base_path}/src/modules/${src}`

			const importedModules = fs.readdirSync(modulesPath).map(getRelativePath).map(require)

			this.routes.register(require(routesPath))
			this.modules.register(importedModules)
		},

		getDatabaseAdapter(name) {
			return this.config.adapter[name || 'sqlite']
		},

		getChildRoutes(route) {
			return route.child || route.modules || route.routes || []
		},

		beforeAction() {
			console.log( "Não sei como fazer ssamerda" )
		},

		logRouteSpawn( route ) {
			console.log('Spawning route:', route.name + '#' +route.action, route.method.toUpperCase(), route.path)
		},

		createRouteForAction(route) {

			const path = require('path')
			const childs = this.getChildRoutes(route)

			if (childs.length > 0) {
				for (let child of childs) {
					this.createRouteForAction({
						path: '/' + path.join(route.path, child.path),
						name: route.name,
						method: child.method,
						action: child.action
					})
				}
			} else {
				const $module = this.modules.getModule(route.name)
				let action = null

				if ( $module.controller && $module.controller[route.action]) {
					action = $module.controller[route.action]
				} else {
					if (defaultController[route.action]) {
						action = defaultController[route.action]
					}
				}

				if (!action) {
					action = () => '\nError:\nUndefined method to action ' + route.action + ' in module: ' + route.name + '\n'
					console.log(action())
				}

				const handler = new RequestHandlerFactory({
					model: $module.model,
					module: $module,
					$models: this.$models,
					route: route,
					$options: this.config
				})

				handler.setAction(action)

				this.logRouteSpawn( route )
				
				this.webServer.registerRoute(route.method, route.path, handler.build())
			}


		},

		async listen(port = 3000, callback) {

			if (base_path) {
				App.init(base_path)
			}

			await bluebird.all(App.queue)

			this.webServer.setViewEngine('pug')
			this.webServer.setViewsPath( path.join( base_path, App.config.path.views) )

			for (let route of this.routes.list) {
				this.createRouteForAction(route)
			}
			
			this.webServer.listen(port)

		}
	}

	App.start = App.listen
	App.up = App.listen


	const parseRoute = (route) => {
		const [name, action] = route.action.split('#')
		return {
			...route,
			action,
			name,
		}
	}

	App.routes = {
		
		defaultRoute : {
			method: 'get',
			path: '/',
			action: 'index'
		},

		list: [],

		register(toRegister) {
			if (toRegister instanceof Array) {
				for (let item of toRegister) {
					this.register(item)
				}
			} else if (toRegister.resource && toRegister.path) {
				this.list.push( createDefaultRoutes(toRegister.resource, toRegister.path) )
			} else {
				this.list.push({
					...this.defaultRoute,
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

			const asyncRegister = async (cf) => {
				// console.log( Object.keys(cf.model) )
				const model =
					(cf && cf.model && Object.keys(cf.model).length > 0)
						? await App.createModel(cf)
						: {}


				const _module = {
					...cf,
					model
				}


				_module.scope = _module
				_module.controller = cf.controller

				this.list.push(_module)

			}

			if (config instanceof Array) {
				for (childConfig of config) {
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
