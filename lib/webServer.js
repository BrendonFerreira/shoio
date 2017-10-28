class WebServer {
	constructor(middlewheres = []) {
		const express = require('express')
		const bodyParser = require('body-parser')
		const morgan = require('morgan')
		const path = require('path')
		const fs = require('fs')

		let app = express()
		this.app = app
		this.app.use((r, res, next) => {
			console.log(arguments)
			next()
		})
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
		// Applying middlewheres for this route

		for (let middlewhere of this.middlewheres.concat(middlewheres)) {
			this.app[method](path, middlewheres)
		}

		this.app[method](path, action)
	}

	listen(number) {
		this.app.listen(number)
	}
}

module.exports = WebServer