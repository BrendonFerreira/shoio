class WebServer {
	constructor(middlewheres = []) {
		const express = require('express')
		const bodyParser = require('body-parser')
		const morgan = require('morgan')
		const path = require('path')
		const fs = require('fs')

        this.app = express()
		this.app.use(morgan('dev'))
		this.app.use(bodyParser.json())

		this.middlewheres = middlewheres
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

	listen(number) {
		this.app.listen(number)
	}
}

module.exports = WebServer