class RequestHandlerFactory {
	constructor(scope) {
		this.scope = scope
		this.action = null
	}

	setAction(fn) {
		this.action = fn
	}

	isActionSetted() {
		return !!this.action
	}


	build() {
		return async (request, response, next) => {

			this.scope.render = (page, data) => {
				response.render(page, data)
				response.end()
			}

			const actionReturn = this.action.call(this.scope, request, response)

			if (actionReturn) {
				if (actionReturn instanceof Promise) {
					response.json(await actionReturn)
				} else {
					response.json(actionReturn)
				}
				response.end()
			} else {
				if (!response.headersSent) {
					console.log('\nWarning: \nYour controller action', moduleAction, 'of', moduleName, 'module, are returning null for the view \nMust be returned Promises, JSON object or String\nWith that, the request will be passed to next middlewhere\n');
					next()
				} else {
					// console.log('Headers already sent')
				}
			}
		}
	}

}

module.exports = RequestHandlerFactory