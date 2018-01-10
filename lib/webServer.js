class WebServer {
	constructor(middlewheres = []) {
		const express = require('express')
		const bodyParser = require('body-parser')
		const path = require('path')
		const fs = require('fs')

        this.app = express()
		this.app.use(bodyParser.json())
		this.server = {}

		this.middlewheres = middlewheres
	}

	use(middlewhere){
		this.app.use( middlewhere )
	}

	setViewEngine(engine) {
		this.app.set('view engine', engine)
	}

	setViewsPath(path) {
		this.app.set('views', path)
	}

	registerRoute(method, path, action, middlewheres = []) {

		for (let middlewhere of this.middlewheres.concat(middlewheres)) {
			this.app[method](path, middlewhere)
		}

		this.app[method](path, action)
	}
	
	close() {
		if( this.server && this.server.close ) {
			this.server.close()
		} 
	}

	listen(number, serverUp) {
		this.server = this.app.listen(number, () => serverUp(this.server))
		return this.app
	}
}

module.exports = WebServer