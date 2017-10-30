class RequestHandlerFactory {
	constructor(scope) {
		this.scope = scope
		this.action = null
		this.isEnded = false
	}

	setAction(fn) {
		this.action = fn
	}

	isActionSetted() {
		return !!this.action
	}

	done() {
		this.isEnded = true
	}

	build() {
		return async (request, response, next) => {

			this.scope.next = (...args) => {
				next( ...args )
				this.done()
			}

			this.scope.render = (page, data) => {
				response.render(page, data)
				response.end()
			}

			const $action = this.action.call(this.scope, request, response, next)
			let actionReturn;

			if ($action && !response.headersSent) {
				if ($action instanceof Promise) {
					actionReturn = await $action 
					if( actionReturn && !response.headersSent ){
						response.json(actionReturn)
						response.end()
					} else {
						if( actionReturn ) {
							console.log( 'The function return', actionReturn, 'was not sent, because the somehow the server already sent an response' )
						} else {
							// the response is already sent
						}
					}
				} else {
					response.json(actionReturn)
					response.end()
				}
			} else {
				if (!response.headersSent && !this.isEnded) {
					console.log('\nWarning: \nYour controller action', this.scope.route.action, 'of', this.scope.route.name, 'module, are returning null for the view \nMust be returned Promises, JSON object or String\nWith that, the request will be passed to next middlewhere\n');
					// next()
				} else {

					// Empty return, the next must be called inside of all middlewheres
					console.log( 'Nothing was sent using this action' )
				}
			}
		}
	}

}

module.exports = RequestHandlerFactory